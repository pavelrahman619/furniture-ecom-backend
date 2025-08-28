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
exports.clientURL = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const content_router_1 = __importDefault(require("./routes/content.router"));
const category_router_1 = __importDefault(require("./routes/category.router"));
const product_router_1 = __importDefault(require("./routes/product.router"));
const order_router_1 = __importDefault(require("./routes/order.router"));
const cart_router_1 = __importDefault(require("./routes/cart.router"));
const delivery_router_1 = __importDefault(require("./routes/delivery.router"));
const payment_router_1 = __importDefault(require("./routes/payment.router"));
const admin_router_1 = __importDefault(require("./routes/admin.router"));
const upload_router_1 = __importDefault(require("./routes/upload.router"));
const erroHandler_1 = require("./middleware/erroHandler");
const cors_1 = __importDefault(require("cors"));
const jwt_service_1 = require("./services/jwt.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// const adminURL = "http://localhost:3001";
// const clientURL = "http://localhost:3000";
// const providerURL = "http://localhost:3002";
const providerURL = "https://agent.shongi.org";
const adminURL = "https://admin.shongi.org";
exports.clientURL = "https://shongi.org";
const corsOptions = {
    // origin: "http://localhost:3000",
    origin: [adminURL, exports.clientURL, providerURL],
    // origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // allowedHeaders: ["Content-Type", "token"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        // origin: ["http://localhost:3001", "http://localhost:3000"],
        origin: adminURL,
        // origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    },
});
const adminSockets = new Map();
io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.on("authenticate", (data) => {
        const { token } = data;
        try {
            const decoded = (0, jwt_service_1.verifyToken)(token);
            if (decoded.role === "admin") {
                adminSockets.set(socket.id, decoded.userId);
                console.log(`Admin connected: ${decoded.userId}`);
            }
        }
        catch (error) {
            console.error("Authentication failed:", error);
            socket.disconnect();
        }
    });
    // Handle disconnection
    socket.on("disconnect", () => {
        adminSockets.delete(socket.id);
        console.log(`Client disconnected: ${socket.id}`);
    });
});
app.set("io", io);
app.set("origins", ["http://localhost:3001", "http://localhost:3000"]);
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.use("/api/users", user_router_1.default);
app.use("/api/auth", auth_router_1.default);
app.use("/api/content", content_router_1.default);
app.use("/api/categories", category_router_1.default);
app.use("/api/products", product_router_1.default);
app.use("/api/orders", order_router_1.default);
app.use("/api/cart", cart_router_1.default);
app.use("/api/delivery", delivery_router_1.default);
app.use("/api/payment", payment_router_1.default);
app.use("/api/admin", admin_router_1.default);
app.use("/api/upload", upload_router_1.default);
app.get("/test-error", (req, res, next) => {
    try {
        throw new Error("Simulated error from test route");
    }
    catch (error) {
        next(error);
    }
});
app.use(erroHandler_1.errorHandler);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err, req, res, next) => {
    console.log("GLOBAL ERROR MIDDLEWARE TRIGGERED");
    console.error(err);
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        next(err);
    }
});
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.warn(`Server running on port ${port}`);
}));
