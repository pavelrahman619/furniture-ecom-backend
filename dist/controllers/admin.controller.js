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
exports.getDashboard = void 0;
const order_model_1 = __importDefault(require("../db/models/order.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
// Get admin dashboard statistics
const getDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get counts and statistics
        const [totalOrders, totalProducts, totalCustomers, recentOrders] = yield Promise.all([
            order_model_1.default.countDocuments(),
            product_model_1.default.countDocuments(),
            user_model_1.default.countDocuments({ role: 'regular' }),
            order_model_1.default.find()
                .sort({ created_at: -1 })
                .limit(10)
                .populate('customer_id')
                .populate('items.product_id')
        ]);
        // Calculate revenue for the current month
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthlyRevenue = yield order_model_1.default.aggregate([
            {
                $match: {
                    created_at: { $gte: currentMonthStart },
                    status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        const revenue = ((_a = monthlyRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        // Get orders by status for quick overview
        const ordersByStatus = yield order_model_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        // Top selling products this month
        const topProducts = yield order_model_1.default.aggregate([
            {
                $match: {
                    created_at: { $gte: currentMonthStart }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product_id',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            }
        ]);
        res.status(200).json({
            total_orders: totalOrders,
            total_products: totalProducts,
            total_customers: totalCustomers,
            monthly_revenue: revenue,
            orders_by_status: ordersByStatus,
            top_products: topProducts,
            recent_orders: recentOrders.map(order => ({
                id: order._id,
                customer: order.customer_id || { first_name: 'Guest', last_name: 'Customer' },
                total: order.total,
                status: order.status,
                created_at: order.created_at,
                items_count: order.items.length
            }))
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getDashboard = getDashboard;
