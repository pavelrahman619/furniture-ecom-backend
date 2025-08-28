import express from "express";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/user.router";
import authRoutes from "./routes/auth.router";
import contentRoutes from "./routes/content.router";
import categoryRoutes from "./routes/category.router";
import productRoutes from "./routes/product.router";
import orderRoutes from "./routes/order.router";
import cartRoutes from "./routes/cart.router";
import deliveryRoutes from "./routes/delivery.router";
import paymentRoutes from "./routes/payment.router";
import adminRoutes from "./routes/admin.router";
import uploadRoutes from "./routes/upload.router";

import { errorHandler } from "./middleware/erroHandler";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./services/jwt.service";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// const adminURL = "http://localhost:3001";
// const clientURL = "http://localhost:3000";
// const providerURL = "http://localhost:3002";
const providerURL = "https://agent.shongi.org";
const adminURL = "https://admin.shongi.org";
export const clientURL = "https://shongi.org";

const corsOptions = {
  // origin: "http://localhost:3000",
  origin: [adminURL, clientURL, providerURL],
  // origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  // allowedHeaders: ["Content-Type", "token"],
  credentials: true,
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:3001", "http://localhost:3000"],
    origin: adminURL,
    // origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});
const adminSockets = new Map<string, string>();

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("authenticate", (data) => {
    const { token } = data;
    try {
      const decoded = verifyToken(token);
      if (decoded.role === "admin") {
        adminSockets.set(socket.id, decoded.userId);
        console.log(`Admin connected: ${decoded.userId}`);
      }
    } catch (error) {
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

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/test-error", (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("Simulated error from test route");
  } catch (error) {
    next(error);
  }
});
app.use(errorHandler);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("GLOBAL ERROR MIDDLEWARE TRIGGERED");
  console.error(err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    next(err);
  }
});

server.listen(port, async () => {
  console.warn(`Server running on port ${port}`);
});
