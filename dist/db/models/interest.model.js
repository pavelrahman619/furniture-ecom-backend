"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const InterestSchema = new Schema({
    appointment: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    agent: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});
const Interest = index_1.default.model("Interest", InterestSchema);
exports.default = Interest;
