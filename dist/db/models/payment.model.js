"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const PaymentsSchema = new Schema({
    appointment: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: [
            "Pending",
            "Appointment_Created",
            "Dues_Pending_From_Customer",
            "Settled_Payment_Request",
            "Settled_Security_Money",
            "Paid",
            "Upgraded_Dues_Pending",
        ],
    },
    total_fee: {
        type: Number,
        required: true,
    },
    customer_paid: {
        type: Number,
        required: true,
    },
    agent_fee: {
        type: Number,
        required: true,
    },
    agent_received: {
        type: Number,
        required: true,
    },
    agent_pending_dues: {
        type: Number,
        required: true,
    },
    security_money: {
        type: Number,
        required: false,
    },
    paymentRequest: {
        type: Boolean,
        required: false,
    },
});
const Payments = index_1.default.model("Payments", PaymentsSchema);
exports.default = Payments;
