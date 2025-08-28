"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const AgentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String,
        required: false,
    },
    nid: {
        type: String,
        required: true,
    },
    zone: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Zone",
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Archived"],
        required: false,
    },
    serial_no: {
        type: Number,
        required: false,
    },
});
const Agent = index_1.default.model("Agent", AgentSchema);
exports.default = Agent;
