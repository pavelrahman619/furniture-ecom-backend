"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const PatientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
    },
    dob: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    isGuest: {
        type: Boolean,
        required: false,
    },
});
const Patient = index_1.default.model("Patient", PatientSchema);
exports.default = Patient;
