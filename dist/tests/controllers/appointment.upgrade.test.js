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
const appointment_controller_1 = require("../../controllers/appointment.controller");
const appointment_model_1 = __importDefault(require("../../db/models/appointment.model"));
const service_model_1 = __importDefault(require("../../db/models/service.model"));
const payment_model_1 = __importDefault(require("../../db/models/payment.model"));
const payments_service_1 = __importDefault(require("../../services/payments.service"));
jest.mock("../../db/models/appointment.model");
jest.mock("../../db/models/service.model");
jest.mock("../../db/models/payment.model");
jest.mock("../../services/payments.service");
describe("updateAppointmentStatus", () => {
    let req;
    let res;
    let jsonMock;
    let statusMock;
    let saveMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
        saveMock = jest.fn();
        req = { params: { id: "testid" }, body: { status: "Returned_Home" } };
        res = { status: statusMock };
        jest.clearAllMocks();
    });
    it("should return 400 if status is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        yield (0, appointment_controller_1.updateAppointmentStatus)(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Status is required",
        });
    }));
    it("should return 404 if appointment not found", () => __awaiter(void 0, void 0, void 0, function* () {
        appointment_model_1.default.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });
        yield (0, appointment_controller_1.updateAppointmentStatus)(req, res);
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Appointment not found",
        });
    }));
    it("should upgrade from 4hr to 6hr if duration > 4hr 10min", () => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = {
            status: "",
            actual_service_start_time: new Date(Date.now() - 4.2 * 60 * 60 * 1000),
            actual_service_end_time: undefined,
            service: { duration: 4 },
            save: saveMock,
        };
        appointment_model_1.default.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(appointment),
        });
        service_model_1.default.findOne.mockResolvedValueOnce({ duration: 6 });
        payment_model_1.default.findOne.mockResolvedValue({});
        payments_service_1.default.upgradePaymentPackage.mockReturnValue({});
        payment_model_1.default.findOneAndUpdate.mockResolvedValue({});
        yield (0, appointment_controller_1.updateAppointmentStatus)(req, res);
        expect(service_model_1.default.findOne).toHaveBeenCalledWith({ duration: 6 });
    }));
    it("should upgrade from 6hr to 8hr if duration > 6hr 10min", () => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = {
            status: "",
            actual_service_start_time: new Date(Date.now() - 6.2 * 60 * 60 * 1000),
            actual_service_end_time: undefined,
            service: { duration: 6 },
            save: saveMock,
        };
        appointment_model_1.default.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(appointment),
        });
        service_model_1.default.findOne.mockResolvedValueOnce({ duration: 8 });
        payment_model_1.default.findOne.mockResolvedValue({});
        payments_service_1.default.upgradePaymentPackage.mockReturnValue({});
        payment_model_1.default.findOneAndUpdate.mockResolvedValue({});
        yield (0, appointment_controller_1.updateAppointmentStatus)(req, res);
        expect(service_model_1.default.findOne).toHaveBeenCalledWith({ duration: 8 });
    }));
    it("should not upgrade if duration is below threshold", () => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = {
            status: "",
            actual_service_start_time: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
            actual_service_end_time: undefined,
            service: { duration: 4 },
            save: saveMock,
        };
        appointment_model_1.default.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(appointment),
        });
        yield (0, appointment_controller_1.updateAppointmentStatus)(req, res);
        expect(service_model_1.default.findOne).not.toHaveBeenCalled();
    }));
});
