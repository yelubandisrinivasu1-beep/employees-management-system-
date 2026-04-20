"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const salaryRoutes_1 = __importDefault(require("./routes/salaryRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const employeeDashboardRoutes_1 = __importDefault(require("./routes/employeeDashboardRoutes"));
const technicalDashboardRoutes_1 = __importDefault(require("./routes/technicalDashboardRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const roleMiddleware_1 = require("./middlewares/roleMiddleware");
const dashboardController_1 = require("./controllers/dashboardController");
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const performanceRoutes_1 = __importDefault(require("./routes/performanceRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const sprintRoutes_1 = __importDefault(require("./routes/sprintRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Employee Management Backend Running",
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/test", testRoutes_1.default);
app.use("/api/employees", employeeRoutes_1.default);
app.use("/api/attendance", attendanceRoutes_1.default);
app.use("/api/salary", salaryRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.get("/api/manager-dashboard", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("manager", "admin"), dashboardController_1.getManagerDashboard);
app.use("/api/employee-dashboard", employeeDashboardRoutes_1.default);
app.use("/api/technical-dashboard", technicalDashboardRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.use("/api/leaves", leaveRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.use("/api/departments", departmentRoutes_1.default);
app.use("/api/teams", teamRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/performance", performanceRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/sprints", sprintRoutes_1.default);
exports.default = app;
