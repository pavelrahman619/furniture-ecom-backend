"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.get("/", order_controller_1.getOrders);
router.get("/:id", order_controller_1.getOrder);
router.post("/", order_controller_1.createOrder);
router.put("/:id/status", order_controller_1.updateOrderStatus);
router.get("/:id/track", order_controller_1.trackOrder);
exports.default = router;
