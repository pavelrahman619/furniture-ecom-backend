"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(`mongodb+srv://shongi:shongi1234@cluster0.mkvtpr5.mongodb.net/shongi?retryWrites=true&w=majority&appName=Cluster0`);
console.log("Mongo DB Connection Successful ");
exports.default = mongoose_1.default;
