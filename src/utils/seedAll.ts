import User from "../models/userModel";
import Employee from "../models/employeeModel";

export const seedAll = async () => {
  try {
    console.log("Seeding default users...");

    // 1. Manager
    let manager = await User.findOne({ email: "manager@example.com" });

    if (!manager) {
      manager = await User.create({
        name: "Default Manager",
        email: "manager@example.com",
        password: "123456",
        role: "manager",
      });
      console.log("Manager created");
    }

    // 2. Technical Manager
    let techManager = await User.findOne({ email: "techmanager@example.com" });

    if (!techManager) {
      techManager = await User.create({
        name: "Default Tech Manager",
        email: "techmanager@example.com",
        password: "123456",
        role: "technical_manager",
      });
      console.log("Technical Manager created");
    }

    // 3. Employee
    let employeeUser = await User.findOne({ email: "employee@example.com" });

    if (!employeeUser) {
      employeeUser = await User.create({
        name: "Default Employee",
        email: "employee@example.com",
        password: "123456",
        role: "employee",
      });
      console.log("Employee created");
    }

    // 4. Employee Profile
    const existingEmployeeProfile = await Employee.findOne({
      user: employeeUser._id,
    });

    if (!existingEmployeeProfile) {
      await Employee.create({
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
  } catch (error) {
    console.error("Seeding error:", error);
  }
};