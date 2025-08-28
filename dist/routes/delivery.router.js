"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const delivery_controller_1 = require("../controllers/delivery.controller");
const router = express_1.default.Router();
router.post("/validate-address", delivery_controller_1.validateAddress);
router.post("/calculate-cost", delivery_controller_1.calculateDeliveryCost);
exports.default = router;
