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
exports.verify = exports.logout = exports.login = void 0;
const jwt_service_1 = require("../services/jwt.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
// Login endpoint - POST /api/auth/login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phone_number } = req.body;
        if ((!email && !phone_number) || !password) {
            res.status(400).json({
                message: "Email or phone number and password are required."
            });
            return;
        }
        const query = email ? { email } : { phone_number };
        const user = yield user_model_1.default.findOne(query);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }
        let token;
        if (user._id)
            token = (0, jwt_service_1.createToken)(user._id);
        const expires_in = 3600; // 1 hour in seconds
        res.status(200).json({
            token,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                role: user.role
            },
            expires_in
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
// Logout endpoint - POST /api/auth/logout
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // In a stateless JWT system, logout is handled client-side
        // But we can still return a success message
        res.status(200).json({
            message: "Successfully logged out"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
// Verify endpoint - GET /api/auth/verify
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                user: null,
                valid: false
            });
            return;
        }
        const decoded = (0, jwt_service_1.verifyToken)(token);
        if (!decoded.userId) {
            res.status(401).json({
                user: null,
                valid: false
            });
            return;
        }
        const user = yield user_model_1.default.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                user: null,
                valid: false
            });
            return;
        }
        res.status(200).json({
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                role: user.role
            },
            valid: true
        });
    }
    catch (error) {
        res.status(401).json({
            user: null,
            valid: false
        });
    }
});
exports.verify = verify;
