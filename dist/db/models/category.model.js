"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image_url: {
        type: String,
        required: false
    },
    parent_id: {
        type: String,
        required: false,
        ref: 'Category'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const Category = index_1.default.model("Category", CategorySchema);
exports.default = Category;
