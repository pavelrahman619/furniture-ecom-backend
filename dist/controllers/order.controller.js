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
exports.trackOrder = exports.updateOrderStatus = exports.createOrder = exports.getOrder = exports.getOrders = void 0;
const order_model_1 = __importDefault(require("../db/models/order.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const order_type_1 = require("../types/order.type");
// Get all orders with filtering and pagination
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", limit = "10", status, customer, date_from, date_to } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // Build filter query
        let filterQuery = {};
        if (status) {
            filterQuery.status = status;
        }
        if (customer) {
            filterQuery.$or = [
                { customer_email: { $regex: customer, $options: 'i' } },
                { customer_phone: { $regex: customer, $options: 'i' } }
            ];
        }
        if (date_from || date_to) {
            filterQuery.created_at = {};
            if (date_from)
                filterQuery.created_at.$gte = new Date(date_from);
            if (date_to)
                filterQuery.created_at.$lte = new Date(date_to);
        }
        const [orders, totalCount] = yield Promise.all([
            order_model_1.default.find(filterQuery)
                .skip(skip)
                .limit(limitNumber)
                .populate('customer_id')
                .sort({ created_at: -1 }),
            order_model_1.default.countDocuments(filterQuery)
        ]);
        const totalPages = Math.ceil(totalCount / limitNumber);
        res.status(200).json({
            orders,
            pagination: {
                current_page: pageNumber,
                total_pages: totalPages,
                total_count: totalCount,
                has_next: pageNumber < totalPages,
                has_prev: pageNumber > 1
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
// Get single order by ID
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield order_model_1.default.findById(id)
            .populate('customer_id')
            .populate('items.product_id');
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({
            order: Object.assign(Object.assign({}, order.toObject()), { customer: order.customer_id, shipping: order.shipping_address, billing: order.billing_address })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getOrder = getOrder;
// Create new order
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items, shipping_address, billing_address, payment_method, customer_id, customer_email, customer_phone } = req.body;
        // Calculate totals
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = yield product_model_1.default.findById(item.product_id);
            if (!product) {
                res.status(400).json({ message: `Product not found: ${item.product_id}` });
                return;
            }
            const itemTotal = item.quantity * item.price;
            subtotal += itemTotal;
            orderItems.push({
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.price,
                name: product.name
            });
        }
        const delivery_cost = subtotal > 500 ? 0 : 50; // Free delivery over $500
        const total = subtotal + delivery_cost;
        const order = new order_model_1.default({
            customer_id,
            customer_email,
            customer_phone,
            items: orderItems,
            shipping_address,
            billing_address,
            payment_method,
            payment_status: 'pending',
            status: order_type_1.OrderStatus.PENDING,
            timeline: [{
                    status: order_type_1.OrderStatus.PENDING,
                    timestamp: new Date(),
                    notes: 'Order created'
                }],
            subtotal,
            delivery_cost,
            total
        });
        yield order.save();
        yield order.populate(['customer_id', 'items.product_id']);
        res.status(201).json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.createOrder = createOrder;
// Update order status
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const order = yield order_model_1.default.findById(id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        // Add to timeline
        order.timeline.push({
            status,
            timestamp: new Date(),
            notes
        });
        order.status = status;
        // Set estimated delivery for shipped orders
        if (status === order_type_1.OrderStatus.SHIPPED && !order.estimated_delivery) {
            order.estimated_delivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            order.tracking_number = `TRK${Date.now()}`;
        }
        yield order.save();
        res.status(200).json({
            status: order.status,
            notes
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Track order
const trackOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield order_model_1.default.findById(id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({
            order: {
                status: order.status,
                timeline: order.timeline,
                tracking_number: order.tracking_number,
                estimated_delivery: order.estimated_delivery
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.trackOrder = trackOrder;
