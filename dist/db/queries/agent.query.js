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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMaxSerialForYear = void 0;
const agent_model_1 = __importDefault(require("../models/agent.model"));
/**
 * Finds the maximum serial_no for a given two-digit year.
 * @param yearDigits - A two-digit string representing the year (e.g., "24" for 2024).
 * @returns The maximum serial_no found for that year, or 0 if none are found.
 */
const findMaxSerialForYear = (yearDigits) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!yearDigits || yearDigits.length !== 2 || !/^\d\d$/.test(yearDigits)) {
        throw new Error("Invalid yearDigits format. Must be a two-digit string (e.g., '24').");
    }
    const yearStart = parseInt(yearDigits + "0000", 10); // e.g., 240000
    const yearEnd = parseInt(yearDigits + "9999", 10); // e.g., 249999
    const result = yield agent_model_1.default.findOne({
        serial_no: {
            $gte: yearStart,
            $lte: yearEnd,
        },
    })
        .sort({ serial_no: -1 }) // Sort by serial_no in descending order
        .select("serial_no") // Only fetch the serial_no
        .lean(); // Return a plain JavaScript object
    return (_a = result === null || result === void 0 ? void 0 : result.serial_no) !== null && _a !== void 0 ? _a : 0;
});
exports.findMaxSerialForYear = findMaxSerialForYear;
