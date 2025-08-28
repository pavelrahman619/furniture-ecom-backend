"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "i am a secret key";
const providerAuthMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        // console.log("token=====", token);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // console.log("Decoded token:", decoded);
        req.user = { providerId: decoded.providerId };
        // console.log(req.user);
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Token is not valid" });
    }
};
exports.providerAuthMiddleware = providerAuthMiddleware;
