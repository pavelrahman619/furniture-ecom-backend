"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const ReviewSchema = new Schema({
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    product_id: {
        type: String,
        required: true,
        ref: "Product",
    },
    user_id: {
        type: String,
        required: true,
        ref: "User",
    },
    verified_purchase: {
        type: Boolean,
        default: false
    },
    helpful_votes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const Review = index_1.default.model("Review", ReviewSchema);
exports.default = Review;
