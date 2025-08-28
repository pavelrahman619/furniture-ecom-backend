"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
// Product CRUD routes
router.get("/", product_controller_1.getProducts);
router.get("/search", product_controller_1.searchProducts);
router.get("/:id", product_controller_1.getProduct);
router.post("/", product_controller_1.createProduct);
router.put("/:id", product_controller_1.updateProduct);
router.delete("/:id", product_controller_1.deleteProduct);
// Stock management routes
router.get("/:id/stock", product_controller_1.getProductStock);
router.put("/:id/stock", product_controller_1.updateProductStock);
exports.default = router;
