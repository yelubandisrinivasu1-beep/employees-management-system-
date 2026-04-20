"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAll = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const seedAll = async () => {
    try {
        console.log("Seeding default users...");
        // 1. Manager
        let manager = await userModel_1.default.findOne({ email: "manager@example.com" });
        if (!manager) {
            manager = await userModel_1.default.create({
                name: "Default Manager",
                email: "manager@example.com",
                password: "123456",
                role: "manager",
            });
            console.log("Manager created");
        }
        // 2. Technical Manager
        let techManager = await userModel_1.default.findOne({ email: "techmanager@example.com" });
        if (!techManager) {
            techManager = await userModel_1.default.create({
                name: "Default Tech Manager",
                email: "techmanager@example.com",
                password: "123456",
                role: "technical_manager",
            });
            console.log("Technical Manager created");
        }
        // 3. Employee
        let employeeUser = await userModel_1.default.findOne({ email: "employee@example.com" });
        if (!employeeUser) {
            employeeUser = await userModel_1.default.create({
                name: "Default Employee",
                email: "employee@example.com",
                password: "123456",
                role: "employee",
            });
            console.log("Employee created");
        }
        // 4. Employee Profile
        const existingEmployeeProfile = await employeeModel_1.default.findOne({
            user: employeeUser._id,
        });
        if (!existingEmployeeProfile) {
            await employeeModel_1.default.create({
                user: employeeUser._id,
                employeeId: "EMP001",
                department: "Development",
                designation: "Frontend Developer",
                dailySalary: 1000,
                managerId: manager._id,
                technicalManagerId: techManager._id,
            });
            console.log("Employee profile created");
        }
        console.log("Seeding completed ✅");
    }
    catch (error) {
        console.error("Seeding error:", error);
    }
};
exports.seedAll = seedAll;
