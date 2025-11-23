import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { setupSwagger } from "./swagger/swagger.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js";
import userStatRoutes from "./routes/userStatRoutes.js"
import { protect, isAdmin } from "./middleware/authMiddleware.js";
import adminLogRoutes from "./routes/adminLogRoutes.js";
import journeyRoutes from "./routes/journeyRoutes.js";
import placeStatusRoutes from "./routes/placeStatusController.js";
import bookingRoutes from "./routes/bookingRoutes.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/place-status', placeStatusRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/notifictions", notificationRoutes);
app.use("/api/stats", userStatRoutes);
app.use("/api/admin/logs", adminLogRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/bookings", bookingRoutes);
setupSwagger(app);
// DB Connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "travel_review_app"
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
