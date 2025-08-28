"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = exports.FeaturedProducts = exports.SaleSection = exports.Banner = void 0;
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
// Banner Schema
const BannerSchema = new Schema({
    image_url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    button_text: {
        type: String,
        required: false
    },
    button_link: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
// Sale Section Schema
const SaleSectionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount_text: {
        type: String,
        required: true
    },
    products: [{
            type: String,
            ref: 'Product'
        }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
// Featured Products Schema
const FeaturedProductsSchema = new Schema({
    product_ids: [{
            type: String,
            ref: 'Product'
        }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
// Footer Schema
const FooterSchema = new Schema({
    about_text: {
        type: String,
        required: true
    },
    contact_info: {
        phone: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        }
    },
    social_links: {
        facebook: {
            type: String,
            required: false
        },
        instagram: {
            type: String,
            required: false
        },
        twitter: {
            type: String,
            required: false
        },
        linkedin: {
            type: String,
            required: false
        }
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
exports.Banner = index_1.default.model("Banner", BannerSchema);
exports.SaleSection = index_1.default.model("SaleSection", SaleSectionSchema);
exports.FeaturedProducts = index_1.default.model("FeaturedProducts", FeaturedProductsSchema);
exports.Footer = index_1.default.model("Footer", FooterSchema);
