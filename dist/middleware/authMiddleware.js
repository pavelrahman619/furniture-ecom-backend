"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_service_1 = require("../services/jwt.service");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("token");
        const JWTPayload = (0, jwt_service_1.verifyToken)(token);
        // const JWTPayload = { userId: "674c66d51629c43591abede4" };
        const user_id = JWTPayload.userId;
        req.body.user_id = user_id;
        delete req.body.token;
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
