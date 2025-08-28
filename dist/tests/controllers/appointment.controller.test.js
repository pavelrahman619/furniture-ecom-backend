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
const otp_service_1 = require("../../services/otp.service");
const appointment_model_1 = __importDefault(require("../../db/models/appointment.model"));
const service_model_1 = __importDefault(require("../../db/models/service.model"));
const payment_model_1 = __importDefault(require("../../db/models/payment.model"));
const patient_model_1 = __importDefault(require("../../db/models/patient.model"));
jest.mock("../../services/otp.service");
jest.mock("../../db/models/appointment.model");
jest.mock("../../db/models/service.model");
jest.mock("../../db/models/payment.model");
jest.mock("../../db/models/patient.model");
describe("postAppointment SMS sendOTP", () => {
    it("should send SMS with order number, date, and time", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const mockPatient = { _id: "686149f78898515eb3022dfa", user: "userid123" };
        patient_model_1.default.findById.mockResolvedValue(mockPatient);
        const mockReq = {
            body: {
                existing_patient_id: "686149f78898515eb3022dfa",
                user_id: "userid123",
                service_id: "68128b44b86537466dcb99f7",
                selectedDate: "2025-06-29T23:00:00.000Z",
                startTime: "10:00",
                endTime: "16:00",
                contact_info: "01711000000",
                homeAddress: "Gulshan 1",
                servicePointAddress: "Dhaka Medical College Hospital, Shahbag",
                agentGenderPreference: "male",
                transport: "UBER",
                paymentOption: "0%",
                paymentMethod: "cash",
                additionalDetails: "",
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        const mockNext = jest.fn();
        const mockAppointment = {
            _id: "686149f88898515eb3022dfc",
            date: "2025-06-29T23:00:00.000Z",
            home_address: "Gulshan 1",
            hospital_address: "Dhaka Medical College Hospital, Shahbag",
            preferred_agent_gender: "male",
            transport_mode: "UBER",
            status: "Pending",
            contact_info: "01711000000",
            additional_details: "",
            payment_option: "0%",
            payment_method: "cash",
            time_frame: {
                start_time: "T_1000",
                end_time: "T_1600",
            },
            patient: "686149f78898515eb3022dfa",
            service: "68128b44b86537466dcb99f7",
            createdAt: "2025-06-29T14:13:12.085Z",
            updatedAt: "2025-07-01T05:36:22.869Z",
            __v: 0,
        };
        appointment_model_1.default.create.mockResolvedValue(mockAppointment);
        service_model_1.default.findOne.mockResolvedValue({ price: 100 });
        payment_model_1.default.create.mockResolvedValue({});
        otp_service_1.sendOTP.mockResolvedValue("sms sent");
        // Act
        yield (0, appointment_controller_1.postAppointment)(mockReq, mockRes, mockNext);
        console.log("sendOTP called with:", otp_service_1.sendOTP.mock.calls[0]);
        // Assert
        expect(otp_service_1.sendOTP).toHaveBeenCalledWith("01711000000", expect.stringMatching(/Appt#\w{6} on 30\/06\/2025 at 10:00 booked\./));
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockAppointment);
    }));
});
