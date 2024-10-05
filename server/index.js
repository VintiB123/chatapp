import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { compare } from "bcrypt";
import authRoutes from "./routes/AuthRoute.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import { signup } from "./controllers/AuthController.js";
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3801;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

setupSocket(server);
mongoose
  .connect(databaseURL)
  .then(() => console.log("DB connection successful."))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  });
