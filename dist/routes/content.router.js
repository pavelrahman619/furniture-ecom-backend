"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const content_controller_1 = require("../controllers/content.controller");
const router = express_1.default.Router();
// Banner routes
router.get("/banner", content_controller_1.getBanner);
router.put("/banner", content_controller_1.updateBanner);
// Sale section routes
router.get("/sale-section", content_controller_1.getSaleSection);
router.put("/sale-section", content_controller_1.updateSaleSection);
// Featured products routes
router.get("/featured-products", content_controller_1.getFeaturedProducts);
router.put("/featured-products", content_controller_1.updateFeaturedProducts);
// Footer routes
router.get("/footer", content_controller_1.getFooter);
router.put("/footer", content_controller_1.updateFooter);
exports.default = router;
