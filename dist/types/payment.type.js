"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
var status;
(function (status) {
    status["Pending"] = "Pending";
    status["Appointment_Created"] = "Appointment_Created";
    status["Dues_Pending_From_Customer"] = "Dues_Pending_From_Customer";
    status["Settled_Payment_Request"] = "Settled_Payment_Request";
    status["Settled_Security_Money"] = "Settled_Security_Money";
    status["Paid"] = "Paid";
    status["Upgraded_Dues_Pending"] = "Upgraded_Dues_Pending";
})(status || (exports.status = status = {}));
