"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const Schema = index_1.default.Schema;
const ScheduleSchema = new Schema({
    agent: {
        type: Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
    },
    day: {
        type: String,
        enum: ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"],
        required: true,
    },
    timeslot: {
        type: String,
        enum: [
            "T_0000",
            "T_0030",
            "T_0100",
            "T_0130",
            "T_0200",
            "T_0230",
            "T_0300",
            "T_0330",
            "T_0400",
            "T_0430",
            "T_0500",
            "T_0530",
            "T_0600",
            "T_0630",
            "T_0700",
            "T_0730",
            "T_0800",
            "T_0830",
            "T_0900",
            "T_0930",
            "T_1000",
            "T_1030",
            "T_1100",
            "T_1130",
            "T_1200",
            "T_1230",
            "T_1300",
            "T_1330",
            "T_1400",
            "T_1430",
            "T_1500",
            "T_1530",
            "T_1600",
            "T_1630",
            "T_1700",
            "T_1730",
            "T_1800",
            "T_1830",
            "T_1900",
            "T_1930",
            "T_2000",
            "T_2030",
            "T_2100",
            "T_2130",
            "T_2200",
            "T_2230",
            "T_2300",
            "T_2330",
        ],
        required: true,
    },
});
const Schedule = index_1.default.model("Schedule", ScheduleSchema);
exports.default = Schedule;
