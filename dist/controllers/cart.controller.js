"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../db/models/cart.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
// Get cart contents
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, session_id } = req.query;
        let cart;
        if (user_id) {
            cart = yield cart_model_1.default.findOne({ user_id }).populate('items.product_id');
        }
        else if (session_id) {
            cart = yield cart_model_1.default.findOne({ session_id }).populate('items.product_id');
        }
        else {
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
        yield cart.save();
        res.status(200).json({
            items: cart.items.map(item => ({
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.price
            })),
            total: cart.total
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCart = getCart;
// Add item to cart
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const product = yield product_model_1.default.findById(product_id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        // Get price from variant or product
        let price = product.price;
        if (variant_id) {
            const variant = product.variants.find(v => { var _a; return ((_a = v._id) === null || _a === void 0 ? void 0 : _a.toString()) === variant_id; });
            if (variant) {
                price = variant.price;
            }
        }
        // Find or create cart
        const query = user_id ? { user_id } : { session_id };
        let cart = yield cart_model_1.default.findOne(query);
        if (!cart) {
            cart = new cart_model_1.default({
                user_id,
                session_id,
                items: [],
                total: 0
            });
        }
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => {
            var _a;
            return item.product_id.toString() === product_id &&
                (((_a = item.variant_id) === null || _a === void 0 ? void 0 : _a.toString()) === variant_id || (!item.variant_id && !variant_id));
        });
        if (existingItemIndex >= 0) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
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
        yield cart.save();
        res.status(200).json({
            product_id,
            variant_id,
            quantity: existingItemIndex >= 0 ? cart.items[existingItemIndex].quantity : quantity
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addToCart = addToCart;
// Update cart item quantity
const updateCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const cart = yield cart_model_1.default.findOne(query);
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        // Find the item to update
        const itemIndex = cart.items.findIndex(item => {
            var _a;
            return item.product_id.toString() === product_id &&
                (((_a = item.variant_id) === null || _a === void 0 ? void 0 : _a.toString()) === variant_id || (!item.variant_id && !variant_id));
        });
        if (itemIndex === -1) {
            res.status(404).json({ message: "Item not found in cart" });
            return;
        }
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        }
        else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }
        // Calculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        yield cart.save();
        res.status(200).json({
            product_id,
            variant_id,
            quantity
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCartItem = updateCartItem;
// Remove item from cart
const removeFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const cart = yield cart_model_1.default.findOne(query);
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }
        // Remove the item
        cart.items = cart.items.filter(item => {
            var _a;
            return !(item.product_id.toString() === product_id &&
                (((_a = item.variant_id) === null || _a === void 0 ? void 0 : _a.toString()) === variant_id || (!item.variant_id && !variant_id)));
        });
        // Calculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        yield cart.save();
        res.status(200).json({
            product_id,
            variant_id
        });
    }
    catch (error) {
        next(error);
    }
});
exports.removeFromCart = removeFromCart;
