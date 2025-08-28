"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_type_1 = require("../../types/order.type");
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const OrderItemSchema = new Schema({
    product_id: {
        type: String,
        required: true,
        ref: 'Product'
    },
    variant_id: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});
const AddressSchema = new Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip_code: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: 'US'
    }
});
const OrderTimelineSchema = new Schema({
    status: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        required: false
    }
});
const OrderSchema = new Schema({
    customer_id: {
        type: String,
        required: false,
        ref: 'User'
    },
    customer_email: {
        type: String,
        required: false
    },
    customer_phone: {
        type: String,
        required: false
    },
    items: [OrderItemSchema],
    shipping_address: {
        type: AddressSchema,
        required: true
    },
    billing_address: {
        type: AddressSchema,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        required: true,
        default: 'pending'
    },
    status: {
        type: String,
        enum: Object.values(order_type_1.OrderStatus),
        default: order_type_1.OrderStatus.PENDING
    },
    timeline: [OrderTimelineSchema],
    tracking_number: {
        type: String,
        required: false
    },
    estimated_delivery: {
        type: Date,
        required: false
    },
    subtotal: {
        type: Number,
        required: true
    },
    delivery_cost: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const Order = index_1.default.model("Order", OrderSchema);
exports.default = Order;
