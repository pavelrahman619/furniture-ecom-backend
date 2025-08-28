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
exports.getCategoryProducts = exports.getCategories = void 0;
const category_model_1 = __importDefault(require("../db/models/category.model"));
const product_model_1 = __importDefault(require("../db/models/product.model"));
// Get all categories
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find().sort({ name: 1 });
        res.status(200).json({
            categories: categories.map(cat => ({
                id: cat._id,
                name: cat.name,
                slug: cat.slug,
                image_url: cat.image_url,
                parent_id: cat.parent_id
            }))
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCategories = getCategories;
// Get products by category
const getCategoryProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { page = "1", limit = "12", filters } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // Build filter query
        let filterQuery = { category_id: id };
        if (filters) {
            try {
                const parsedFilters = JSON.parse(filters);
                if (parsedFilters.price_min || parsedFilters.price_max) {
                    filterQuery.price = {};
                    if (parsedFilters.price_min)
                        filterQuery.price.$gte = parsedFilters.price_min;
                    if (parsedFilters.price_max)
                        filterQuery.price.$lte = parsedFilters.price_max;
                }
                if (parsedFilters.color) {
                    filterQuery["variants.color"] = parsedFilters.color;
                }
                if (parsedFilters.material) {
                    filterQuery["variants.material"] = parsedFilters.material;
                }
            }
            catch (error) {
                console.error("Error parsing filters:", error);
            }
        }
        const [products, totalCount] = yield Promise.all([
            product_model_1.default.find(filterQuery)
                .skip(skip)
                .limit(limitNumber)
                .populate('category_id')
                .sort({ created_at: -1 }),
            product_model_1.default.countDocuments(filterQuery)
        ]);
        const totalPages = Math.ceil(totalCount / limitNumber);
        res.status(200).json({
            products,
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
exports.getCategoryProducts = getCategoryProducts;
