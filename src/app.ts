import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import jobsRoutes from "./routes/jobsRoutes";
import applicationRoutes from "./routes/applicationRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the HireMe backend!");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationRoutes);

export default app;
