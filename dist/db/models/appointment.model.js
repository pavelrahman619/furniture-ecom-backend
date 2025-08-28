"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const AppointmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
    },
    date: {
        type: Date,
        required: false,
    },
    home_address: {
        type: String,
        required: false,
    },
    hospital_address: {
        type: String,
        required: false,
    },
    preferred_agent_gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: false,
    },
    transport_mode: {
        type: String,
        enum: ["UBER", "Own_car", "CNG", "Public_transport", "Agent_preference"],
        required: false,
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Fixed_Agent",
            "Agent_Reached_Home",
            "Reached_Center",
            "Returned_Home",
            "Dues_Cleared",
            "Cancelled",
            "Dues_Pending",
        ],
        required: false,
    },
    contact_info: {
        type: String,
        required: false,
    },
    additional_details: {
        type: String,
        required: false,
    },
    payment_option: {
        type: String,
        enum: ["100%", "30%", "0%"],
        required: false,
    },
    payment_method: {
        type: String,
        enum: ["bkash", "nagad", "card", "cash"],
        required: false,
    },
    time_frame: {
        start_time: {
            type: String,
            required: false,
        },
        end_time: {
            type: String,
            required: false,
        },
    },
    agent: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Agent",
    },
    patient: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Patient",
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    actual_service_start_time: {
        type: Date,
        required: false,
    },
    actual_service_end_time: {
        type: Date,
        required: false,
    },
    review_sms_failed: {
        type: Boolean,
        default: false,
    },
    review_link: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});
const Appointment = index_1.default.model("Appointment", AppointmentSchema);
exports.default = Appointment;
