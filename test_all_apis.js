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
  console.log("Starting API Tests...\n");
  const randomStr = Math.random().toString(36).substring(7);

  // 1. Auth & Registration
  console.log("--- Testing Auth API ---");
  const adminEmail = `admin_${randomStr}@test.com`;
  const empEmail = `emp_${randomStr}@test.com`;
  
  await fetchApi('/auth/register', 'POST', { name: "Admin Test", email: adminEmail, password: "password", role: "admin" });
  await fetchApi('/auth/register', 'POST', { name: "Employee Test", email: empEmail, password: "password", role: "employee" });
  console.log("✓ Registered Admin and Employee");

  const adminLogin = await fetchApi('/auth/login', 'POST', { email: adminEmail, password: "password" });
  if (!adminLogin.data?.token) {
    fs.writeFileSync('error.log', JSON.stringify({ reason: "Admin login failed", response: adminLogin }));
    throw new Error("Admin login failed");
  }
  const adminToken = adminLogin.data.token;
  const adminUserId = adminLogin.data.data._id;
  
  const empLogin = await fetchApi('/auth/login', 'POST', { email: empEmail, password: "password" });
  const empToken = empLogin.data.token;
  const empUserId = empLogin.data.data._id;
  console.log("✓ Logged in effectively. Received tokens.");

  // 2. Employee Profile
  console.log("\n--- Testing Employee API ---");
  const createEmp = await fetchApi('/employees', 'POST', {
    user: empUserId,
    employeeId: `E-${randomStr}`,
    department: 'Engineering',
    designation: 'Developer',
    dailySalary: 200,
    joiningDate: new Date().toISOString()
  }, adminToken);
  console.log(`Create Employee: ${createEmp.status} ${createEmp.data?.success ? "Success" : "Failed"}`);
  
  const getEmpResp = await fetchApi('/employees', 'GET', null, adminToken);
  console.log(`GetAll Employees: ${getEmpResp.status} Count: ${getEmpResp.data?.count || 0}`);

  // 3. Dashboards
  console.log("\n--- Testing Dashboard APIs ---");
  const adminDash = await fetchApi('/manager-dashboard', 'GET', null, adminToken);
  console.log(`Manager/Admin Dashboard: ${adminDash.status}`);
  
  const empDash = await fetchApi('/employee-dashboard', 'GET', null, empToken);
  console.log(`Employee Dashboard: ${empDash.status}`);

  // 4. Tasks
  console.log("\n--- Testing Tasks API ---");
  const taskRes = await fetchApi('/tasks', 'POST', {
    title: "Test Task",
    description: "Please complete this test task",
    assignedTo: empUserId,
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: "high"
  }, adminToken);
  console.log(`Create Task: ${taskRes.status} ${taskRes.data?.message || 'Failed'}`);
  
  const allTasks = await fetchApi('/tasks', 'GET', null, adminToken);
  console.log(`Get All Tasks: ${allTasks.status}`);

  // 5. Leaves
  console.log("\n--- Testing Leaves API ---");
  const leaveRes = await fetchApi('/leaves', 'POST', {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
    reason: "Sick Leave",
    leaveType: "Sick"
  }, empToken);
  console.log(`Employee Apply Leave: ${leaveRes.status} ${leaveRes.data?.message || 'Failed'}`);
  
  const adminLeaves = await fetchApi('/leaves', 'GET', null, adminToken);
  console.log(`Admin Get Leaves: ${adminLeaves.status}`);

  // 6. Attendance
  console.log("\n--- Testing Attendance API ---");
  const attendanceRes = await fetchApi('/attendance', 'POST', {
    employeeId: empUserId,
    date: new Date().toISOString(),
    status: "present"
  }, adminToken);
  console.log(`Admin Mark Attendance: ${attendanceRes.status} ${attendanceRes.data?.message || 'Failed'}`);

  // 7. Salary
  console.log("\n--- Testing Salary API ---");
  const salaryRes = await fetchApi('/salary/generate', 'POST', {
    employeeId: empUserId,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }, adminToken);
  console.log(`Generate Salary: ${salaryRes.status} ${salaryRes.data?.message || 'Failed'}`);
  
  console.log("\nAll requested CRUD tests executed!");
}

runTests().catch(console.error);
