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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../db/models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_service_1 = require("../services/jwt.service");
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", limit = "10", role } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        let query = {};
        if (role) {
            query.role = role;
        }
        const [users, totalCount] = yield Promise.all([
            user_model_1.default.find(query)
                .select('-password')
                .skip(skip)
                .limit(limitNumber)
                .sort({ created_at: -1 }),
            user_model_1.default.countDocuments(query)
        ]);
        const totalPages = Math.ceil(totalCount / limitNumber);
        res.json({
            users,
            pagination: {
                current_page: pageNumber,
                total_pages: totalPages,
                total_count: totalCount,
                has_next: pageNumber < totalPages,
                has_prev: pageNumber > 1
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_model_1.default.findById(id).select('-password');
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, password, email, phone_number } = req.body;
        // Validate required fields
        if (!password) {
            res.status(400).json({ message: "Password is required." });
            return;
        }
        if (!email && !phone_number) {
            res.status(400).json({ message: "Either email or phone number is required." });
            return;
        }
        let hashedPassword = "";
        if (password)
            hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const validRoles = ["admin", "regular", "super_admin"];
        if (role && !validRoles.includes(role)) {
            res.status(400).json({ message: "Invalid role provided." });
            return;
        }
        // Check if user already exists
        const existingUser = yield user_model_1.default.findOne({
            $or: [
                ...(email ? [{ email }] : []),
                ...(phone_number ? [{ phone_number }] : [])
            ]
        });
        if (existingUser) {
            res.status(409).json({ message: "User already exists with this email or phone number." });
            return;
        }
        const newUser = yield user_model_1.default.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword, role: role || "regular" }));
        if (newUser) {
            const token = (0, jwt_service_1.createToken)(newUser === null || newUser === void 0 ? void 0 : newUser._id);
            // Don't send password in response
            const userResponse = {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone_number: newUser.phone_number,
                role: newUser.role
            };
            res.status(201).json({
                message: "User created successfully.",
                user: userResponse,
                token: token,
            });
        }
        else {
            res.status(500).json({ message: "Failed to create user." });
        }
    }
    catch (error) {
        console.error("Error in createUser:", error);
        next(error);
    }
});
exports.createUser = createUser;
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Remove sensitive fields from update
        const _a = req.body, { password } = _a, updateData = __rest(_a, ["password"]);
        // If password is being updated, hash it
        if (password) {
            updateData.password = yield bcryptjs_1.default.hash(password, 10);
        }
        const updated = yield user_model_1.default.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (updated) {
            res.status(200).json(updated);
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.editUser = editUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleted = yield user_model_1.default.deleteOne({
            _id: id,
        });
        if (deleted) {
            res.status(204).send(); // No content
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
