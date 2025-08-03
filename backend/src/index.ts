import './utils/config.js'
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from './routes/category.route.js'
import contentRoutes from "./routes/content.route.js"
import linkRoutes from "./routes/link.route.js"
import { connectDB } from './config/db.js';
import { redirectByHash } from "./controllers/link.controller.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/content" , contentRoutes) ;

app.use("/api/links" , linkRoutes) ;

app.get("/link/:hash",redirectByHash) ;

const PORT = process.env.PORT || 8000;

console.log("Starting server...");
console.log("Environment:", {
  JWT_SECRET: process.env.JWT_SECRET ? "✓ Set" : "✗ Missing",
  MONGODB_URI: process.env.MONGODB_URI ? "✓ Set" : "✗ Missing",
  PORT: PORT
});

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log("Available endpoints:");
    console.log("  POST /api/auth/register");
    console.log("  POST /api/auth/login");
    console.log("  GET  /api/category");
    console.log("  GET  /api/content");
    console.log("  GET  /api/links");
  });
});
