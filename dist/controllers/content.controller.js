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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFooter = exports.getFooter = exports.updateFeaturedProducts = exports.getFeaturedProducts = exports.updateSaleSection = exports.getSaleSection = exports.updateBanner = exports.getBanner = void 0;
const content_model_1 = require("../db/models/content.model");
// Banner endpoints
const getBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banner = yield content_model_1.Banner.findOne({ active: true });
        if (!banner) {
            res.status(404).json({ message: "No active banner found" });
            return;
        }
        res.status(200).json({
            image_url: banner.image_url,
            title: banner.title,
            button_text: banner.button_text,
            button_link: banner.button_link
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBanner = getBanner;
const updateBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image_url, title, button_text, button_link } = req.body;
        const banner = yield content_model_1.Banner.findOneAndUpdate({ active: true }, {
            image_url,
            title,
            button_text,
            button_link,
            active: true
        }, { new: true, upsert: true });
        res.status(200).json({
            image_url: banner.image_url,
            title: banner.title,
            button_text: banner.button_text,
            button_link: banner.button_link
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateBanner = updateBanner;
// Sale section endpoints
const getSaleSection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saleSection = yield content_model_1.SaleSection.findOne({ active: true }).populate('products');
        if (!saleSection) {
            res.status(404).json({ message: "No active sale section found" });
            return;
        }
        res.status(200).json({
            title: saleSection.title,
            description: saleSection.description,
            discount_text: saleSection.discount_text,
            products: saleSection.products
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSaleSection = getSaleSection;
const updateSaleSection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, discount_text, products } = req.body;
        const saleSection = yield content_model_1.SaleSection.findOneAndUpdate({ active: true }, {
            title,
            description,
            discount_text,
            products,
            active: true
        }, { new: true, upsert: true }).populate('products');
        res.status(200).json({
            title: saleSection.title,
            description: saleSection.description,
            discount_text: saleSection.discount_text,
            products: saleSection.products
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateSaleSection = updateSaleSection;
// Featured products endpoints
const getFeaturedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const featuredProducts = yield content_model_1.FeaturedProducts.findOne().populate('product_ids');
        if (!featuredProducts) {
            res.status(404).json({ message: "No featured products found" });
            return;
        }
        res.status(200).json({
            products: featuredProducts.product_ids
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getFeaturedProducts = getFeaturedProducts;
const updateFeaturedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_ids } = req.body;
        const featuredProducts = yield content_model_1.FeaturedProducts.findOneAndUpdate({}, { product_ids }, { new: true, upsert: true }).populate('product_ids');
        res.status(200).json({
            product_ids: featuredProducts.product_ids
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateFeaturedProducts = updateFeaturedProducts;
// Footer endpoints
const getFooter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const footer = yield content_model_1.Footer.findOne();
        if (!footer) {
            res.status(404).json({ message: "Footer content not found" });
            return;
        }
        res.status(200).json({
            about_text: footer.about_text,
            contact_info: footer.contact_info,
            social_links: footer.social_links
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getFooter = getFooter;
const updateFooter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { about_text, contact_info, social_links } = req.body;
        const footer = yield content_model_1.Footer.findOneAndUpdate({}, {
            about_text,
            contact_info,
            social_links
        }, { new: true, upsert: true });
        res.status(200).json({
            about_text: footer.about_text,
            contact_info: footer.contact_info,
            social_links: footer.social_links
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateFooter = updateFooter;
