"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_fee = 30;
const vat = 0.15;
const payment_option_map = {
    "100%": 1,
    "30%": 0.3,
    "0%": 0,
};
const createPaymentInstance = (appointment, service) => {
    console.log(appointment);
    const payment = {};
    payment.appointment = appointment._id;
    payment.status = "Appointment_Created";
    payment.total_fee = service.price + platform_fee + service.price * vat;
    payment.customer_paid =
        payment_option_map[appointment.payment_option] * service.price +
            (payment_option_map[appointment.payment_option] === 0
                ? 0
                : platform_fee + service.price * vat);
    payment.agent_fee = service.price * 0.8;
    payment.agent_received = 0;
    payment.agent_pending_dues = 0;
    payment.security_money = 0;
    payment.paymentRequest = false;
    return payment;
};
const updateOnDuesPending = (payment) => ({
    status: "Dues_Pending_From_Customer",
    agent_pending_dues: payment.agent_fee - payment.agent_fee / 8,
    security_money: payment.agent_fee / 8,
    payment_request: false,
});
const updateOnDuesCleared = (payment) => ({
    status: "Dues_Cleared_By_Customer",
    customer_paid: payment.total_fee,
    agent_received: payment.total_fee - payment.customer_paid,
    agent_pending_dues: payment.agent_pending_dues - (payment.total_fee - payment.customer_paid),
});
const updateOnPaymentRequest = (payment) => (Object.assign(Object.assign({}, payment), { payment_request: true }));
const updateOnSettlePaymentRequest = (payment) => ({
    status: "Settled_Payment_Request",
    agent_received: payment.agent_fee - payment.agent_fee / 8,
    agent_pending_dues: 0,
    payment_request: false,
});
const updateOnSettleSecurityMoney = () => ({
    security_money: 0,
});
const upgradePaymentPackage = (payment, upgradedService, appointment) => {
    const new_total_fee = upgradedService.price + platform_fee + upgradedService.price * vat;
    const new_customer_paid = payment_option_map[appointment.payment_option] * upgradedService.price +
        (payment_option_map[appointment.payment_option] === 0
            ? 0
            : platform_fee + upgradedService.price * vat);
    const new_agent_fee = upgradedService.price * 0.8;
    const agent_received = payment.agent_received;
    const security_money = payment.security_money;
    const paymentRequest = payment.paymentRequest;
    const new_agent_pending_dues = new_agent_fee;
    return {
        total_fee: new_total_fee,
        customer_paid: new_customer_paid,
        agent_fee: new_agent_fee,
        status: "Upgraded_Dues_Pending",
        agent_received: agent_received,
        agent_pending_dues: new_agent_pending_dues,
        security_money: security_money,
        paymentRequest: paymentRequest,
    };
};
exports.default = {
    createPaymentInstance,
    updateOnDuesPending,
    updateOnDuesCleared,
    updateOnPaymentRequest,
    updateOnSettlePaymentRequest,
    updateOnSettleSecurityMoney,
    upgradePaymentPackage,
};
