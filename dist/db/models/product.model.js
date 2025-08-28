"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const ProductVariantSchema = new Schema({
    color: {
        type: String,
        required: false
    },
    material: {
        type: String,
        required: false
    },
    size: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true
    }
});
const ProductImageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: false
    },
    is_primary: {
        type: Boolean,
        default: false
    }
});
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    category_id: {
        type: String,
        required: true,
        ref: 'Category'
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    variants: [ProductVariantSchema],
    images: [ProductImageSchema],
    featured: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const Product = index_1.default.model("Product", ProductSchema);
exports.default = Product;
