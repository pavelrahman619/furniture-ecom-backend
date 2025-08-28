"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = void 0;
const jwt_service_1 = require("../services/jwt.service");
const optionalAuthMiddleware = (req, res, next) => {
    try {
        const token = req.header("token");
        if (token) {
            try {
                const JWTPayload = (0, jwt_service_1.verifyToken)(token);
                const user_id = JWTPayload.userId;
                req.body.user_id = user_id;
            }
            catch (tokenError) {
                console.log("Invalid token provided, proceeding without authentication:", tokenError);
                req.body.user_id = null;
            }
        }
        else {
            req.body.user_id = null;
        }
        delete req.body.token;
        next();
    }
    catch (error) {
        console.log("Error in optionalAuthMiddleware:", error);
        req.body.user_id = null;
        delete req.body.token;
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
