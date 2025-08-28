"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const CartItemSchema = new Schema({
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
    }
});
const CartSchema = new Schema({
    user_id: {
        type: String,
        required: false,
        ref: 'User'
    },
    session_id: {
        type: String,
        required: false
    },
    items: [CartItemSchema],
    total: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const Cart = index_1.default.model("Cart", CartSchema);
exports.default = Cart;
