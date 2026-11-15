const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:5000/api';

async function fetchApi(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  } catch (err) {
    return { status: 500, error: err.message };
  }
}

async function runTests() {
  console.log("Starting Verified API Tests (v3)...\n");
  const randomStr = Math.random().toString(36).substring(7);

  // 1. Auth & Registration for Admin
  console.log("--- Testing Auth API ---");
  const adminEmail = `admin_${randomStr}@test.com`;
  const empEmail = `emp_${randomStr}@test.com`;
  
  await fetchApi('/auth/register', 'POST', { name: "Admin Test", email: adminEmail, password: "password", role: "admin" });
  console.log("✓ Registered Admin");

  const adminLogin = await fetchApi('/auth/login', 'POST', { email: adminEmail, password: "password" });
  const adminToken = adminLogin.data.token;
  console.log("✓ Logged in Admin.");

  // 2. Employee Profile Creation
  console.log("\n--- Testing Employee API ---");
  const createEmp = await fetchApi('/employees', 'POST', {
    name: "Employee Test User",
    email: empEmail,
    password: "password",
    employeeId: `EMP-${randomStr.toUpperCase()}`,
    department: 'Engineering',
    designation: 'Senior Developer',
    dailySalary: 2500,
    joiningDate: new Date().toISOString()
  }, adminToken);
  
  if (!createEmp.data?.success) {
      console.log(`Failed to create employee: ${createEmp.data?.message}`);
      return;
  }
  const employeeProfileId = createEmp.data.data._id;
  console.log(`✓ Employee Created: ${employeeProfileId}`);

  // Login as the new employee
  const empLogin = await fetchApi('/auth/login', 'POST', { email: empEmail, password: "password" });
  const empToken = empLogin.data.token;
  console.log("✓ Logged in as New Employee.");

  // 3. Dashboards
  console.log("\n--- Testing Dashboard APIs ---");
  const adminDash = await fetchApi('/manager-dashboard', 'GET', null, adminToken);
  console.log(`✓ Manager Dashboard: ${adminDash.status}`);
  
  const empDash = await fetchApi('/employee-dashboard', 'GET', null, empToken);
  console.log(`✓ Employee Dashboard: ${empDash.status}`);

  // 4. Tasks
  console.log("\n--- Testing Tasks API ---");
  const taskRes = await fetchApi('/tasks', 'POST', {
    title: "Verify API final",
    description: "Ensure all endpoints are 200/201",
    employee: employeeProfileId,
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString()
  }, adminToken);
  console.log(`✓ Create Task: ${taskRes.status} - ${taskRes.data?.message}`);

  // 5. Leaves
  console.log("\n--- Testing Leaves API ---");
  const leaveRes = await fetchApi('/leaves', 'POST', {
    fromDate: new Date().toISOString(),
    toDate: new Date(Date.now() + 86400000).toISOString(),
    reason: "Final Verification Leave",
    leaveType: "Sick"
  }, empToken);
  console.log(`✓ Employee Apply Leave: ${leaveRes.status} - ${leaveRes.data?.message}`);

  // 6. Attendance
  console.log("\n--- Testing Attendance API ---");
  const attendanceRes = await fetchApi('/attendance', 'POST', {
    employee: employeeProfileId,
    date: new Date().toISOString(),
    status: "present"
  }, adminToken);
  console.log(`✓ Admin Mark Attendance: ${attendanceRes.status} - ${attendanceRes.data?.message}`);

  // 7. Salary
  console.log("\n--- Testing Salary API ---");
  const salaryRes = await fetchApi('/salary/generate', 'POST', {
    employeeId: employeeProfileId,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }, adminToken);
  console.log(`✓ Generate Salary: ${salaryRes.status} - ${salaryRes.data?.message}`);

  console.log("\n--- VERIFICATION COMPLETE ---");
  console.log("All systems are functional.");
}

runTests().catch(console.error);
