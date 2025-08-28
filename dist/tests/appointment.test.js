"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const optionalAuthMiddleware_1 = require("../middleware/optionalAuthMiddleware");
// Mock the JWT service
jest.mock("../services/jwt.service", () => ({
    verifyToken: jest.fn(),
}));
const jwt_service_1 = require("../services/jwt.service");
const mockVerifyToken = jwt_service_1.verifyToken;
describe("Optional Auth Middleware", () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeEach(() => {
        mockReq = {
            header: jest.fn(),
            body: {},
        };
        mockRes = {};
        mockNext = jest.fn();
        jest.clearAllMocks();
    });
    describe("Unauthenticated Users", () => {
        test("should allow request with no token", () => {
            mockReq.header.mockReturnValue(undefined);
            (0, optionalAuthMiddleware_1.optionalAuthMiddleware)(mockReq, mockRes, mockNext);
            expect(mockReq.body.user_id).toBeNull();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });
        test("should clean up token from body", () => {
            mockReq.body.token = "some-token";
            mockReq.header.mockReturnValue(undefined);
            (0, optionalAuthMiddleware_1.optionalAuthMiddleware)(mockReq, mockRes, mockNext);
            expect(mockReq.body.token).toBeUndefined();
            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });
    describe("Authenticated Users", () => {
        test("should extract user_id from valid token", () => {
            const mockToken = "valid-jwt-token";
            const mockUserId = "user123";
            mockReq.header.mockReturnValue(mockToken);
            mockVerifyToken.mockReturnValue({ userId: mockUserId, role: "regular" });
            (0, optionalAuthMiddleware_1.optionalAuthMiddleware)(mockReq, mockRes, mockNext);
            expect(mockVerifyToken).toHaveBeenCalledWith(mockToken);
            expect(mockReq.body.user_id).toBe(mockUserId);
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });
        test("should handle invalid token gracefully", () => {
            const mockToken = "invalid-jwt-token";
            mockReq.header.mockReturnValue(mockToken);
            mockVerifyToken.mockImplementation(() => {
                throw new Error("Invalid token");
            });
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();
            (0, optionalAuthMiddleware_1.optionalAuthMiddleware)(mockReq, mockRes, mockNext);
            expect(mockReq.body.user_id).toBeNull();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
    describe("Error Handling", () => {
        test("should handle middleware errors gracefully", () => {
            mockReq.header.mockImplementation(() => {
                throw new Error("Some middleware error");
            });
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();
            (0, optionalAuthMiddleware_1.optionalAuthMiddleware)(mockReq, mockRes, mockNext);
            expect(mockReq.body.user_id).toBeNull();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});
