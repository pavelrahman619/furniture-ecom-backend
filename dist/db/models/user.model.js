"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: false,
    },
    phone_number: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    sex: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    profile_picture: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["admin", "regular", "agent", "super_admin"],
    },
    password: {
        type: String,
        required: false,
    },
    date_of_birth: {
        type: Date,
        required: false,
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
    },
});
const User = index_1.default.model("User", UserSchema);
exports.default = User;
