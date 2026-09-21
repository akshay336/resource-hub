// Centralized Master Datasets matching Internal_Project_Resource_Management_Demo_v3

export const INITIAL_EMPLOYEES = [
  { id: "EMP001", name: "Amit Sharma", department: "Engineering", designation: "Technical Lead", location: "Pune", experience: "8.0", status: "Active", email: "amit.sharma@resourcehub.corp", skills: ["DOTNET", "AZURE", "DOCKER", "AGILE"] },
  { id: "EMP002", name: "Priya Patil", department: "Engineering", designation: "Senior Software Engineer", location: "Pune", experience: "6.0", status: "Active", email: "priya.patil@resourcehub.corp", skills: ["ANGULAR", "REACT", "NODEJS"] },
  { id: "EMP003", name: "Rahul Joshi", department: "Engineering", designation: "Software Engineer", location: "Mumbai", experience: "4.0", status: "Active", email: "rahul.joshi@resourcehub.corp", skills: ["REACT", "NESTJS", "MYSQL"] },
  { id: "EMP004", name: "Neha Kulkarni", department: "QA", designation: "Senior QA Engineer", location: "Pune", experience: "7.0", status: "Active", email: "neha.kulkarni@resourcehub.corp", skills: ["SELENIUM", "DOCKER", "AGILE"] },
  { id: "EMP005", name: "Vikram Deshmukh", department: "Engineering", designation: "Technical Architect", location: "Bangalore", experience: "10.0", status: "Active", email: "vikram.deshmukh@resourcehub.corp", skills: ["DOTNET", "AZURE", "K8S", "RAG"] },
  { id: "EMP006", name: "Sneha Shinde", department: "Engineering", designation: "Senior Software Engineer", location: "Pune", experience: "5.5", status: "Active", email: "sneha.shinde@resourcehub.corp", skills: ["ANGULAR", "REACT", "NODEJS"] },
  { id: "EMP007", name: "Karan Mehta", department: "Engineering", designation: "Software Engineer", location: "Hyderabad", experience: "3.5", status: "Active", email: "karan.mehta@resourcehub.corp", skills: ["ANGULAR", "NODEJS", "MYSQL"] },
  { id: "EMP008", name: "Anjali Rao", department: "PMO", designation: "Project Manager", location: "Pune", experience: "8.0", status: "Active", email: "pm.rao@resourcehub.corp", skills: ["AGILE", "PMP"] },
  { id: "EMP009", name: "Sanjay Verma", department: "PMO", designation: "Delivery Head", location: "Pune", experience: "11.0", status: "Active", email: "dh.verma@resourcehub.corp", skills: ["AGILE", "AZURE", "PMP"] },
  { id: "EMP010", name: "Meera Nair", department: "HR", designation: "HR Manager", location: "Mumbai", experience: "9.0", status: "Active", email: "hr.nair@resourcehub.corp", skills: ["TALENT", "AGILE"] }
];

export const INITIAL_SKILLS = [
  { code: "ANGULAR", name: "Angular", category: "Frontend", experience: "5+" },
  { code: "REACT", name: "React", category: "Frontend", experience: "3+" },
  { code: "NODEJS", name: "Node.js", category: "Backend", experience: "4+" },
  { code: "DOTNET", name: ".NET / ASP.NET Core", category: "Backend", experience: "10+" },
  { code: "NESTJS", name: "NestJS", category: "Backend", experience: "3+" },
  { code: "MYSQL", name: "MySQL", category: "Database", experience: "6+" },
  { code: "AZURE", name: "Microsoft Azure", category: "Cloud", experience: "5+" },
  { code: "DOCKER", name: "Docker", category: "DevOps", experience: "4+" },
  { code: "K8S", name: "Kubernetes", category: "DevOps", experience: "3+" },
  { code: "SELENIUM", name: "Selenium", category: "Testing", experience: "5+" },
  { code: "RAG", name: "RAG / GenAI", category: "AI", experience: "2+" },
  { code: "AGILE", name: "Agile / Scrum", category: "Project", experience: "8+" }
];

export const INITIAL_CERTS = [
  { code: "AZ104", name: "Microsoft Azure Administrator Associate", issuer: "Microsoft", validUntil: "2027-02-01", status: "Active" },
  { code: "AZ305", name: "Azure Solutions Architect Expert", issuer: "Microsoft", validUntil: "2027-06-01", status: "Active" },
  { code: "AWS_SAA", name: "AWS Solutions Architect", issuer: "AWS", validUntil: "2027-01-20", status: "Active" },
  { code: "CKA", name: "Certified Kubernetes Administrator", issuer: "CNCF", validUntil: "2028-03-01", status: "Active" },
  { code: "PMP", name: "Project Management Professional", issuer: "PMI", validUntil: "2026-09-01", status: "Expiring Soon" },
  { code: "PSM", name: "Professional Scrum Master", issuer: "Scrum.org", validUntil: "2027-03-01", status: "Active" }
];

export const INITIAL_CLIENTS = [
  { id: "CLI001", name: "Acme Technologies", contact: "John Carter", country: "USA", status: "Active" },
  { id: "CLI002", name: "Global Retail Solutions", contact: "Sarah Wilson", country: "USA", status: "Active" },
  { id: "CLI003", name: "FinServe India", contact: "Raj Malhotra", country: "India", status: "Active" },
  { id: "CLI004", name: "HealthPlus Systems", contact: "Emily Brown", country: "USA", status: "Active" }
];

export const INITIAL_PROJECTS = [
  { id: "PRJ001", name: "Phoenix Digital Platform", client: "Acme Technologies", pm: "Anjali Rao", start: "2026-01-01", end: "2026-12-31", status: "Active", priority: "High" },
  { id: "PRJ002", name: "Atlas Commerce", client: "Global Retail Solutions", pm: "Anjali Rao", start: "2026-03-01", end: "2026-10-31", status: "Active", priority: "Critical" },
  { id: "PRJ003", name: "Orion Analytics", client: "FinServe India", pm: "Anjali Rao", start: "2026-04-01", end: "2026-12-15", status: "Active", priority: "High" },
  { id: "PRJ004", name: "Nova CRM & Healthcare", client: "HealthPlus Systems", pm: "Amit Sharma", start: "2026-09-15", end: "2027-03-31", status: "Planned", priority: "Medium" }
];

export const INITIAL_PROJECT_STRUCTURES = [
  { id: "STR-001", projectId: "PRJ001", projectName: "Phoenix Digital Platform", role: "Project Manager", requiredCount: 1, allocatedCount: 1, allocationPct: "100%" },
  { id: "STR-002", projectId: "PRJ001", projectName: "Phoenix Digital Platform", role: "Business Analyst", requiredCount: 1, allocatedCount: 1, allocationPct: "50%" },
  { id: "STR-003", projectId: "PRJ001", projectName: "Phoenix Digital Platform", role: "Frontend Developer", requiredCount: 2, allocatedCount: 1, allocationPct: "100%" },
  { id: "STR-004", projectId: "PRJ001", projectName: "Phoenix Digital Platform", role: "Backend Developer", requiredCount: 2, allocatedCount: 2, allocationPct: "100%" },
  { id: "STR-005", projectId: "PRJ001", projectName: "Phoenix Digital Platform", role: "QA Engineer", requiredCount: 1, allocatedCount: 0, allocationPct: "50%" },
  { id: "STR-006", projectId: "PRJ002", projectName: "Atlas Commerce", role: "Project Manager", requiredCount: 1, allocatedCount: 1, allocationPct: "100%" },
  { id: "STR-007", projectId: "PRJ002", projectName: "Atlas Commerce", role: "Backend Developer", requiredCount: 2, allocatedCount: 1, allocationPct: "100%" },
  { id: "STR-008", projectId: "PRJ002", projectName: "Atlas Commerce", role: "Frontend Developer", requiredCount: 2, allocatedCount: 2, allocationPct: "100%" },
  { id: "STR-009", projectId: "PRJ003", projectName: "Orion Analytics", role: "Project Manager", requiredCount: 1, allocatedCount: 1, allocationPct: "100%" },
  { id: "STR-010", projectId: "PRJ003", projectName: "Orion Analytics", role: "Business Analyst", requiredCount: 1, allocatedCount: 0, allocationPct: "50%" }
];

export const INITIAL_ALLOCATIONS = [
  { id: "ALC-001", empId: "EMP001", empName: "Amit Sharma", projectId: "PRJ001", projectName: "Phoenix Digital Platform", allocation: "50%", start: "2026-01-01", end: "2026-12-31", status: "Active" },
  { id: "ALC-002", empId: "EMP002", empName: "Priya Patil", projectId: "PRJ001", projectName: "Phoenix Digital Platform", allocation: "100%", start: "2026-01-15", end: "2026-09-30", status: "Active" },
  { id: "ALC-003", empId: "EMP003", empName: "Rahul Joshi", projectId: "PRJ002", projectName: "Atlas Commerce", allocation: "100%", start: "2026-03-01", end: "2026-10-31", status: "Active" },
  { id: "ALC-004", empId: "EMP005", empName: "Vikram Deshmukh", projectId: "PRJ002", projectName: "Atlas Commerce", allocation: "50%", start: "2026-04-01", end: "2026-12-15", status: "Active" },
  { id: "ALC-005", empId: "EMP004", empName: "Neha Kulkarni", projectId: "PRJ004", projectName: "Nova CRM & Healthcare", allocation: "50%", start: "2026-09-15", end: "2027-03-31", status: "Planned" }
];

export const INITIAL_SHARING_REQUESTS = [
  { id: "RSR-001", employeeName: "Rahul Joshi", fromProjectId: "PRJ001", fromProjectName: "Phoenix Digital Platform", toProjectId: "PRJ002", toProjectName: "Atlas Commerce", requiredPct: "40%", otherPm: "John Carter", status: "Pending" },
  { id: "RSR-002", employeeName: "Sneha Shinde", fromProjectId: "PRJ003", fromProjectName: "Orion Analytics", toProjectId: "PRJ001", toProjectName: "Phoenix Digital Platform", requiredPct: "30%", otherPm: "Anjali Rao", status: "Accepted" },
  { id: "RSR-003", employeeName: "Karan Mehta", fromProjectId: "PRJ004", fromProjectName: "Nova CRM & Healthcare", toProjectId: "PRJ001", toProjectName: "Phoenix Digital Platform", requiredPct: "25%", otherPm: "Meera Shah", status: "Rejected" }
];

export const INITIAL_RESOURCE_REQUESTS = [
  { id: "RR-2026-001", projectId: "PRJ001", role: "Senior Angular Developer", experience: "4.0 yrs", allocation: "100%", start: "2026-10-01", end: "2026-12-31", priority: "High", status: "Requested" },
  { id: "RR-2026-002", projectId: "PRJ002", role: ".NET/Azure Engineer", experience: "5.0 yrs", allocation: "50%", start: "2026-09-15", end: "2026-12-15", priority: "Critical", status: "Under Review" },
  { id: "RR-2026-003", projectId: "PRJ003", role: "Node.js Developer", experience: "3.0 yrs", allocation: "100%", start: "2026-11-01", end: "2027-01-31", priority: "Medium", status: "Shortlisted" },
  { id: "RR-2026-004", projectId: "PRJ004", role: "QA Engineer", experience: "4.0 yrs", allocation: "50%", start: "2026-09-15", end: "2027-03-31", priority: "Medium", status: "Approved" }
];

export const INITIAL_LEAVES = [
  { id: "LEV-001", empId: "EMP002", empName: "Priya Patil", type: "Annual Leave", from: "2026-09-14", to: "2026-09-18", status: "Approved" },
  { id: "LEV-002", empId: "EMP006", empName: "Sneha Shinde", type: "Planned Leave", from: "2026-10-12", to: "2026-10-16", status: "Planned" },
  { id: "LEV-003", empId: "EMP003", empName: "Rahul Joshi", type: "Personal Leave", from: "2026-09-28", to: "2026-09-29", status: "Approved" }
];

export const INITIAL_WORK_ITEMS = [
  { code: "AO-644", title: "Cloud Storage using manujusha account not Zec", projectId: "PRJ001", projectName: "Phoenix Digital Platform", type: "Bug", priority: "High" },
  { code: "AO-645", title: "Cloud Storage setup setting not reloaded on change", projectId: "PRJ001", projectName: "Phoenix Digital Platform", type: "Bug", priority: "Medium" },
  { code: "AO-646", title: "Show message showing how many files found", projectId: "PRJ001", projectName: "Phoenix Digital Platform", type: "Feature", priority: "Low" },
  { code: "AO-647", title: "Not parsing sections of IIF on Cloud Storage sync", projectId: "PRJ001", projectName: "Phoenix Digital Platform", type: "Bug", priority: "Critical" },
  { code: "PHX-101", title: "Angular Dashboard state caching & socket integration", projectId: "PRJ001", projectName: "Phoenix Digital Platform", type: "Feature", priority: "High" },
  { code: "PHX-102", title: "Authentication middleware token refresh handler", projectId: "PRJ001", projectName: "Phoenix Digital Platform", type: "Task", priority: "High" },
  { code: "ATC-204", title: "Checkout payment gateway webhook integration", projectId: "PRJ002", projectName: "Atlas Commerce", type: "Feature", priority: "High" },
  { code: "ATC-205", title: "Product catalog indexing & Elasticsearch cluster", projectId: "PRJ002", projectName: "Atlas Commerce", type: "Task", priority: "Medium" },
  { code: "ORN-301", title: "Data pipeline ETL extraction optimization", projectId: "PRJ003", projectName: "Orion Analytics", type: "Task", priority: "Medium" }
];

export const INITIAL_TIMESHEETS = [
  // Mon 08 Jun 2026 (Total 8h)
  {
    id: "TS-1001",
    empId: "EMP003",
    empName: "Akshay Jadhav",
    date: "2026-06-08",
    dateFormatted: "08/Jun/26",
    day: "Mon",
    taskCode: "AO-644",
    taskTitle: "Cloud Storage using manujusha account not Zec",
    duration: 6,
    durationStr: "6h",
    description: "Working on work item AO-644 cloud storage connection",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "08 Jun 2026, 05:30 PM",
    status: "Logged"
  },
  {
    id: "TS-1002",
    empId: "EMP003",
    empName: "Akshay Jadhav",
    date: "2026-06-08",
    dateFormatted: "08/Jun/26",
    day: "Mon",
    taskCode: "AO-645",
    taskTitle: "Cloud Storage setup setting not reloaded on change",
    duration: 2,
    durationStr: "2h",
    description: "Fixed reload trigger event in settings tab",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "08 Jun 2026, 06:45 PM",
    status: "Logged"
  },
  // Tue 09 Jun 2026 (Total 8h)
  {
    id: "TS-1003",
    empId: "EMP003",
    empName: "Akshay Jadhav",
    date: "2026-06-09",
    dateFormatted: "09/Jun/26",
    day: "Tue",
    taskCode: "AO-645",
    taskTitle: "Cloud Storage setup setting not reloaded on change",
    duration: 6,
    durationStr: "6h",
    description: "Debugging storage handler event subscriber",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "09 Jun 2026, 04:30 PM",
    status: "Logged"
  },
  {
    id: "TS-1004",
    empId: "EMP003",
    empName: "Akshay Jadhav",
    date: "2026-06-09",
    dateFormatted: "09/Jun/26",
    day: "Tue",
    taskCode: "AO-646",
    taskTitle: "Show message showing how many files found",
    duration: 2,
    durationStr: "2h",
    description: "Implemented status banner showing synced file counts",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "09 Jun 2026, 06:30 PM",
    status: "Logged"
  },
  // Wed 10 Jun 2026 (Total 8h)
  {
    id: "TS-1005",
    empId: "EMP003",
    empName: "Akshay Jadhav",
    date: "2026-06-10",
    dateFormatted: "10/Jun/26",
    day: "Wed",
    taskCode: "AO-647",
    taskTitle: "Not parsing sections of IIF on Cloud Storage sync",
    duration: 8,
    durationStr: "8h",
    description: "Refactored IIF file parser stream processing",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "10 Jun 2026, 06:00 PM",
    status: "Logged"
  },
  // Thu 11 Jun 2026 (Total 8h)
  {
    id: "TS-1006",
    empId: "EMP003",
    empName: "Akshay Jadhav",
    date: "2026-06-11",
    dateFormatted: "11/Jun/26",
    day: "Thu",
    taskCode: "AO-647",
    taskTitle: "Not parsing sections of IIF on Cloud Storage sync",
    duration: 8,
    durationStr: "8h",
    description: "Unit testing for IIF parser edge cases & exception handling",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "11 Jun 2026, 06:00 PM",
    status: "Logged"
  },
  // Fri 12 Jun 2026 (Total 8h)
  {
    id: "TS-1007",
    empId: "EMP003",
    empName: "Akshay Jadhav",
    date: "2026-06-12",
    dateFormatted: "12/Jun/26",
    day: "Fri",
    taskCode: "AO-647",
    taskTitle: "Not parsing sections of IIF on Cloud Storage sync",
    duration: 8,
    durationStr: "8h",
    description: "Regression test suite run and pull request merge",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "12 Jun 2026, 05:15 PM",
    status: "Logged"
  },

  // Additional Employee Worklogs for Amit Sharma (EMP001)
  {
    id: "TS-1008",
    empId: "EMP001",
    empName: "Amit Sharma",
    date: "2026-06-08",
    dateFormatted: "08/Jun/26",
    day: "Mon",
    taskCode: "PHX-101",
    taskTitle: "Angular Dashboard state caching & socket integration",
    duration: 8,
    durationStr: "8h",
    description: "Integrated Redis state cache for live dashboard",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "08 Jun 2026, 05:00 PM",
    status: "Logged"
  },
  {
    id: "TS-1009",
    empId: "EMP001",
    empName: "Amit Sharma",
    date: "2026-06-09",
    dateFormatted: "09/Jun/26",
    day: "Tue",
    taskCode: "PHX-102",
    taskTitle: "Authentication middleware token refresh handler",
    duration: 8,
    durationStr: "8h",
    description: "Implemented JWT silent renewal middleware",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "09 Jun 2026, 06:00 PM",
    status: "Logged"
  },
  {
    id: "TS-1010",
    empId: "EMP001",
    empName: "Amit Sharma",
    date: "2026-06-10",
    dateFormatted: "10/Jun/26",
    day: "Wed",
    taskCode: "PHX-102",
    taskTitle: "Authentication middleware token refresh handler",
    duration: 8,
    durationStr: "8h",
    description: "Security review and token revocation testing",
    projectId: "PRJ001",
    projectName: "Phoenix Digital Platform",
    loggedAt: "10 Jun 2026, 05:30 PM",
    status: "Logged"
  }
];
