import { Request, Response, NextFunction } from "express";
import Cart from "../db/models/cart.model";
import Product from "../db/models/product.model";

// Get cart contents
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user_id, session_id } = req.query;

    let cart;
    if (user_id) {
      cart = await Cart.findOne({ user_id }).populate('items.product_id');
    } else if (session_id) {
      cart = await Cart.findOne({ session_id }).populate('items.product_id');
    } else {
      res.status(400).json({ message: "User ID or Session ID required" });
      return;
    }

    if (!cart) {
      res.status(200).json({
        items: [],
        total: 0
      });
      return;
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    cart.total = total;
    await cart.save();

    res.status(200).json({
      items: cart.items.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price
      })),
      total: cart.total
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { product_id, variant_id, quantity, user_id, session_id } = req.body;

    if (!product_id || !quantity) {
      res.status(400).json({ message: "Product ID and quantity are required" });
      return;
    }

    if (!user_id && !session_id) {
      res.status(400).json({ message: "User ID or Session ID required" });
      return;
    }

    // Get product to verify it exists and get price
    const product = await Product.findById(product_id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Get price from variant or product
    let price = product.price;
    if (variant_id) {
      const variant = product.variants.find(v => v._id?.toString() === variant_id);
      if (variant) {
        price = variant.price;
      }
    }

    // Find or create cart
    const query = user_id ? { user_id } : { session_id };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        user_id,
        session_id,
        items: [],
        total: 0
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id && 
               (item.variant_id?.toString() === variant_id || (!item.variant_id && !variant_id))
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product_id,
        variant_id,
        quantity,
        price
      });
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    await cart.save();

    res.status(200).json({
      product_id,
      variant_id,
      quantity: existingItemIndex >= 0 ? cart.items[existingItemIndex].quantity : quantity
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { product_id, variant_id, quantity, user_id, session_id } = req.body;

    if (!product_id || quantity === undefined) {
      res.status(400).json({ message: "Product ID and quantity are required" });
      return;
    }

    if (!user_id && !session_id) {
      res.status(400).json({ message: "User ID or Session ID required" });
      return;
    }

    const query = user_id ? { user_id } : { session_id };
    const cart = await Cart.findOne(query);

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Find the item to update
    const itemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id && 
               (item.variant_id?.toString() === variant_id || (!item.variant_id && !variant_id))
    );

    if (itemIndex === -1) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    await cart.save();

    res.status(200).json({
      product_id,
      variant_id,
      quantity
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { product_id, variant_id, user_id, session_id } = req.body;

    if (!product_id) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    if (!user_id && !session_id) {
      res.status(400).json({ message: "User ID or Session ID required" });
      return;
    }

    const query = user_id ? { user_id } : { session_id };
    const cart = await Cart.findOne(query);

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Remove the item
    cart.items = cart.items.filter(
      item => !(item.product_id.toString() === product_id && 
                (item.variant_id?.toString() === variant_id || (!item.variant_id && !variant_id)))
    );

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    await cart.save();

    res.status(200).json({
      product_id,
      variant_id
    });
  } catch (error) {
    next(error);
  }
};

