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
exports.calculateDeliveryCost = exports.validateAddress = void 0;
// Validate delivery address
const validateAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address } = req.body;
        if (!address || !address.street || !address.city || !address.state || !address.zip_code) {
            res.status(400).json({
                address,
                is_valid: false,
                is_in_zone: false,
                distance_miles: 0
            });
            return;
        }
        // Simplified validation logic
        // In a real app, you'd integrate with a service like Google Maps API
        const validStates = ['CA', 'NY', 'TX', 'FL', 'WA', 'OR', 'NV', 'AZ'];
        const isInZone = validStates.includes(address.state.toUpperCase());
        // Simulate distance calculation
        const distance_miles = isInZone ? Math.floor(Math.random() * 500) + 10 : 999;
        res.status(200).json({
            address,
            is_valid: true,
            is_in_zone: isInZone,
            distance_miles
        });
    }
    catch (error) {
        next(error);
    }
});
exports.validateAddress = validateAddress;
// Calculate delivery cost
const calculateDeliveryCost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, order_total } = req.body;
        if (!address || !order_total) {
            res.status(400).json({ message: "Address and order total are required" });
            return;
        }
        // Simplified delivery cost calculation
        let delivery_cost = 0;
        const is_free = order_total >= 500; // Free delivery over $500
        if (!is_free) {
            // Base delivery cost
            delivery_cost = 50;
            // Additional cost based on distance (simplified)
            if (address.state && !['CA', 'NY', 'TX'].includes(address.state.toUpperCase())) {
                delivery_cost += 25; // Additional cost for distant states
            }
        }
        res.status(200).json({
            address,
            order_total,
            delivery_cost,
            is_free
        });
    }
    catch (error) {
        next(error);
    }
});
exports.calculateDeliveryCost = calculateDeliveryCost;
