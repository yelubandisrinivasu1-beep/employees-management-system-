import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import salaryRoutes from "./routes/salaryRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import employeeDashboardRoutes from "./routes/employeeDashboardRoutes";
import technicalDashboardRoutes from "./routes/technicalDashboardRoutes";
import taskRoutes from "./routes/taskRoutes";
import { protect } from "./middlewares/authMiddleware";
import { authorize } from "./middlewares/roleMiddleware";
import { getManagerDashboard } from "./controllers/dashboardController";
import leaveRoutes from "./routes/leaveRoutes";

import chatRoutes from "./routes/chatRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import teamRoutes from "./routes/teamRoutes";
import projectRoutes from "./routes/projectRoutes";
import performanceRoutes from "./routes/performanceRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import sprintRoutes from "./routes/sprintRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Employee Management Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get(
  "/api/manager-dashboard",
  protect,
  authorize("manager", "admin"),
  getManagerDashboard
);
app.use("/api/employee-dashboard", employeeDashboardRoutes);
app.use("/api/technical-dashboard", technicalDashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sprints", sprintRoutes);
export default app;