import Attendance from "../models/attendanceModel";
import Employee from "../models/employeeModel";
import mongoose from "mongoose";

export const calculateEmployeeSalary = async (
  employeeId: string,
  month: number,
  year: number
) => {
  let employee;
  if (mongoose.Types.ObjectId.isValid(employeeId)) {
    employee = await Employee.findById(employeeId);
  } else {
    employee = await Employee.findOne({ employeeId });
  }

  if (!employee) {
    throw new Error("Employee not found");
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const attendanceRecords = await Attendance.find({
    employee: employeeId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const presentDays = attendanceRecords.filter((item) => item.status === "present").length;
  const halfDays = attendanceRecords.filter((item) => item.status === "half_day").length;
  const absentDays = attendanceRecords.filter((item) => item.status === "absent").length;
  const leaveDays = attendanceRecords.filter((item) => item.status === "leave").length;

  const totalWorkingDays = attendanceRecords.length;
  const perDaySalary = employee.dailySalary;
  const totalSalary = (presentDays + (halfDays * 0.5)) * perDaySalary;

  return {
    employee: employee._id,
    month,
    year,
    totalWorkingDays,
    presentDays,
    halfDays,
    absentDays,
    leaveDays,
    perDaySalary,
    totalSalary,
  };
};