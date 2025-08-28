"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payment_option = exports.payment_method = exports.transport_mode = exports.gender = exports.status = void 0;
var status;
(function (status) {
    status["Pending"] = "Pending";
    status["Fixed_Agent"] = "Fixed_Agent";
    status["Agent_Reached_Home"] = "Agent_Reached_Home";
    status["Reached_Center"] = "Reached_Center";
    status["Returned_Home"] = "Returned_Home";
    status["Dues_Cleared"] = "Dues_Cleared";
    status["Cancelled"] = "Cancelled";
    status["Dues_Pending"] = "Dues_Pending";
})(status || (exports.status = status = {}));
var gender;
(function (gender) {
    gender["male"] = "Male";
    gender["female"] = "Female";
    gender["other"] = "Other";
})(gender || (exports.gender = gender = {}));
var transport_mode;
(function (transport_mode) {
    transport_mode["UBER"] = "UBER";
    transport_mode["Own_car"] = "Own Car";
    transport_mode["CNG"] = "CNG";
    transport_mode["Public_transport"] = "Public Transport";
    transport_mode["Agent_preference"] = "Agent Preference";
})(transport_mode || (exports.transport_mode = transport_mode = {}));
var payment_method;
(function (payment_method) {
    payment_method["bkash"] = "bkash";
    payment_method["nagad"] = "nagad";
    payment_method["card"] = "card";
})(payment_method || (exports.payment_method = payment_method = {}));
var payment_option;
(function (payment_option) {
    payment_option["100%"] = "100%";
    payment_option["30%"] = "30%";
    payment_option["0%"] = "0%";
})(payment_option || (exports.payment_option = payment_option = {}));
