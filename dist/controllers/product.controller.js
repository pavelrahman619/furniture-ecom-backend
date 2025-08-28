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
exports.updateProductStock = exports.getProductStock = exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const product_model_1 = __importDefault(require("../db/models/product.model"));
const category_model_1 = __importDefault(require("../db/models/category.model"));
// Get all products with filtering and pagination
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", limit = "12", category, price_min, price_max, color, material, search } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // Build filter query
        let filterQuery = {};
        if (category) {
            filterQuery.category_id = category;
        }
        if (price_min || price_max) {
            filterQuery.price = {};
            if (price_min)
                filterQuery.price.$gte = parseFloat(price_min);
            if (price_max)
                filterQuery.price.$lte = parseFloat(price_max);
        }
        if (color) {
            filterQuery["variants.color"] = { $regex: color, $options: 'i' };
        }
        if (material) {
            filterQuery["variants.material"] = { $regex: material, $options: 'i' };
        }
        if (search) {
            filterQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const [products, totalCount, categories] = yield Promise.all([
            product_model_1.default.find(filterQuery)
                .skip(skip)
                .limit(limitNumber)
                .populate('category_id')
                .sort({ created_at: -1 }),
            product_model_1.default.countDocuments(filterQuery),
            category_model_1.default.find().sort({ name: 1 })
        ]);
        // Get available filter options
        const allProducts = yield product_model_1.default.find(filterQuery);
        const filters_available = {
            colors: [...new Set(allProducts.flatMap(p => p.variants.map(v => v.color)).filter(Boolean))],
            materials: [...new Set(allProducts.flatMap(p => p.variants.map(v => v.material)).filter(Boolean))],
            price_range: {
                min: Math.min(...allProducts.map(p => p.price)),
                max: Math.max(...allProducts.map(p => p.price))
            },
            categories: categories.map(cat => ({
                id: cat._id,
                name: cat.name,
                count: allProducts.filter(p => { var _a; return p.category_id.toString() === ((_a = cat._id) === null || _a === void 0 ? void 0 : _a.toString()); }).length
            }))
        };
        const totalPages = Math.ceil(totalCount / limitNumber);
        res.status(200).json({
            products,
            pagination: {
                current_page: pageNumber,
                total_pages: totalPages,
                total_count: totalCount,
                has_next: pageNumber < totalPages,
                has_prev: pageNumber > 1
            },
            filters_available
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProducts = getProducts;
// Get single product by ID
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findById(id).populate('category_id');
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({
            product: Object.assign(Object.assign({}, product.toObject()), { category: product.category_id, stock: product.variants.reduce((total, variant) => total + variant.stock, 0) })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProduct = getProduct;
// Create new product
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, sku, category, price, description, variants, images } = req.body;
        const product = new product_model_1.default({
            name,
            sku,
            category_id: category,
            price,
            description,
            variants: variants || [],
            images: images || [],
            stock: variants ? variants.reduce((total, variant) => total + (variant.stock || 0), 0) : 0
        });
        yield product.save();
        yield product.populate('category_id');
        res.status(201).json({
            id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category_id,
            price: product.price,
            variants: product.variants,
            images: product.images
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createProduct = createProduct;
// Update product
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, sku, category, price, description, variants, images } = req.body;
        const product = yield product_model_1.default.findByIdAndUpdate(id, {
            name,
            sku,
            category_id: category,
            price,
            description,
            variants,
            images,
            stock: variants ? variants.reduce((total, variant) => total + (variant.stock || 0), 0) : 0
        }, { new: true }).populate('category_id');
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({
            id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category_id,
            price: product.price,
            variants: product.variants,
            images: product.images
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
// Search products
const searchProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q, category, filters } = req.query;
        let searchQuery = {};
        if (q) {
            searchQuery.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { sku: { $regex: q, $options: 'i' } }
            ];
        }
        if (category) {
            searchQuery.category_id = category;
        }
        if (filters) {
            try {
                const parsedFilters = JSON.parse(filters);
                Object.assign(searchQuery, parsedFilters);
            }
            catch (error) {
                console.error("Error parsing filters:", error);
            }
        }
        const products = yield product_model_1.default.find(searchQuery)
            .populate('category_id')
            .limit(20)
            .sort({ name: 1 });
        // Generate search suggestions
        const suggestions = products.length > 0 ?
            [...new Set(products.map(p => p.name).slice(0, 5))] :
            [];
        res.status(200).json({
            products,
            suggestions
        });
    }
    catch (error) {
        next(error);
    }
});
exports.searchProducts = searchProducts;
// Get product stock
const getProductStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        // For simplicity, assuming one location
        const locations = [{
                location: "Main Warehouse",
                stock: product.variants.reduce((total, variant) => total + variant.stock, 0),
                more_arriving: false
            }];
        res.status(200).json({ locations });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductStock = getProductStock;
// Update product stock
const updateProductStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { locations } = req.body;
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        // Update total stock (simplified - in real app you'd update variant stocks)
        if (locations && locations[0]) {
            product.stock = locations[0].stock;
            yield product.save();
        }
        res.status(200).json({ locations });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProductStock = updateProductStock;
