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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOTP = exports.verifyOTP = exports.saveOTPPhoneNumber = exports.sendOTP = void 0;
const index_1 = require("../redis/index");
const sendOTP = (mobileNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = new FormData();
        formData.append("api_key", process.env.ADN_API_KEY || "KEY-svhz8j45stq4r6ous60qktwmxrru6ken");
        formData.append("api_secret", process.env.ADN_API_SECRET || "gOfCUZWc4F$D64eS");
        formData.append("request_type", "OTP");
        formData.append("message_type", "TEXT");
        formData.append("mobile", mobileNumber);
        formData.append("message_body", message);
        const res = yield fetch(process.env.SMSAPI ||
            "https://portal.adnsms.com/api/v1/secure/send-sms", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => res)
            .catch((e) => console.log(e));
        if (res.api_response_message === "SUCCESS") {
            return "sms sent";
        }
        else {
            return "";
        }
        // return res;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.sendOTP = sendOTP;
const saveOTPPhoneNumber = (mobileNumber, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        index_1.redis.set(mobileNumber, otp);
        return "OTP saved to redis";
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.saveOTPPhoneNumber = saveOTPPhoneNumber;
const verifyOTP = (mobileNumber, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedOTP = yield index_1.redis.get(mobileNumber);
        if (savedOTP == otp)
            return true;
        else
            return false;
    }
    catch (error) {
        console.log(error);
    }
});
exports.verifyOTP = verifyOTP;
const deleteOTP = (mobileNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_1.redis.del(mobileNumber);
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteOTP = deleteOTP;
