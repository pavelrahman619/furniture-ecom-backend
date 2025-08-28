"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const ServiceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    name_bn: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    icon: {
        type: String,
        required: false,
    },
    icon_bn: {
        type: String,
        required: false,
    },
    serial_number: {
        type: Number,
        required: false,
    },
});
const Service = index_1.default.model("Service", ServiceSchema);
exports.default = Service;
