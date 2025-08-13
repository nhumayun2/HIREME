import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import jobsRoutes from "./routes/jobsRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the HireMe backend!");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin/users", adminRoutes);

export default app;
