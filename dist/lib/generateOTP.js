"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = exports.generateSixDigitNumber = void 0;
const generateSixDigitNumber = () => {
    const min = Math.ceil(100000);
    const max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
};
exports.generateSixDigitNumber = generateSixDigitNumber;
const generateResetToken = (length = 6) => {
    if (length < 6) {
        length = 6;
    }
    else if (length > 8) {
        length = 8;
    }
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Ensure URL-safe by removing any non-alphanumeric characters
    return token.replace(/[^a-zA-Z0-9]/g, "");
};
exports.generateResetToken = generateResetToken;
