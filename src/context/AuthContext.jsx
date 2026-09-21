import React, { createContext, useContext, useState, useEffect } from 'react';

// Enhanced Static Enterprise Demo Accounts across 4 Roles
export const DEMO_ACCOUNTS = [
  {
    id: 'EMP001',
    name: 'Ajay Sharma',
    email: 'admin@resourcehub.corp',
    password: 'Password@123',
    role: 'System Admin',
    roleBadge: 'Super Admin',
    department: 'IT & Infrastructure',
    designation: 'Principal System Administrator',
    location: 'Pune, India',
    phone: '+91 98230 11223',
    joinedDate: '15 Jan 2021',
    avatar: 'AS',
    avatarBg: 'bg-indigo-600',
    assignedProjects: ['ALL'],
    skills: ['Cloud Infrastructure', 'Security & Compliance', 'DevOps', 'Identity Management'],
    permissions: ['all_access', 'user_management', 'system_config', 'audit_logs']
  },
  {
    id: 'EMP009',
    name: 'Sanjay Verma',
    email: 'dh.verma@resourcehub.corp',
    password: 'Password@123',
    role: 'Delivery Head',
    roleBadge: 'Delivery Operations',
    department: 'PMO & Delivery',
    designation: 'Vice President — Delivery Operations',
    location: 'Pune, India',
    phone: '+91 98220 44556',
    joinedDate: '01 Mar 2019',
    avatar: 'SV',
    avatarBg: 'bg-blue-600',
    assignedProjects: ['PRJ001', 'PRJ002', 'PRJ003', 'PRJ004'],
    skills: ['Strategic Delivery', 'Resource Blueprinting', 'Client Governance', 'Capacity Planning'],
    permissions: ['project_blueprint', 'resource_structure', 'enterprise_utilization', 'allocation_override']
  },
  {
    id: 'EMP008',
    name: 'Anjali Rao',
    email: 'pm.rao@resourcehub.corp',
    password: 'Password@123',
    role: 'Project Manager',
    roleBadge: 'Project Lead',
    department: 'Digital Solutions PMO',
    designation: 'Lead Project Manager',
    location: 'Pune, India',
    phone: '+91 98210 77889',
    joinedDate: '10 Jun 2022',
    avatar: 'AR',
    avatarBg: 'bg-emerald-600',
    assignedProjects: ['PRJ001'],
    assignedProjectName: 'Phoenix Digital Platform',
    skills: ['Agile / Scrum', 'PMP', 'Sprint Planning', 'Risk Mitigation'],
    permissions: ['my_projects', 'gap_analysis', 'direct_allocation', 'sharing_requests']
  },
  {
    id: 'EMP010',
    name: 'Meera Nair',
    email: 'hr.nair@resourcehub.corp',
    password: 'Password@123',
    role: 'HR',
    roleBadge: 'HR & Talent',
    department: 'Human Resources',
    designation: 'Senior Talent Acquisition Manager',
    location: 'Mumbai, India',
    phone: '+91 98200 99001',
    joinedDate: '05 Aug 2020',
    avatar: 'MN',
    avatarBg: 'bg-purple-600',
    assignedProjects: ['ALL_BENCH'],
    skills: ['Talent Sourcing', 'Bench Management', 'Skill Ontology', 'Performance Appraisal'],
    permissions: ['employee_crud', 'bench_management', 'candidate_matching', 'leave_calendar']
  }
];

// Complete Role Navigation Map (matching prototype architecture)
export const ROLE_NAVIGATION = {
  'System Admin': [
    { name: 'Dashboard', icon: 'LayoutDashboard', group: 'Overview' },
    { name: 'Employees', icon: 'Users', group: 'Workforce Master' },
    { name: 'Skills', icon: 'Boxes', group: 'Workforce Master' },
    { name: 'Certifications', icon: 'Award', group: 'Workforce Master' },
    { name: 'Clients', icon: 'Building2', group: 'Project Management' },
    { name: 'Projects', icon: 'FolderKanban', group: 'Project Management' },
    { name: 'Project Resource Structure', icon: 'Grid3X3', group: 'Project Management' },
    { name: 'Project Teams', icon: 'UsersRound', group: 'Project Management' },
    { name: 'Timesheets', icon: 'Clock', group: 'Allocations & Demand' },
    { name: 'Resource Requests', icon: 'FileText', group: 'Allocations & Demand' },
    { name: 'Resource Allocation', icon: 'CalendarDays', group: 'Allocations & Demand' },
    { name: 'Bench Resources', icon: 'Hourglass', group: 'Allocations & Demand' },
    { name: 'Resource Availability', icon: 'CalendarClock', group: 'Allocations & Demand' },
    { name: 'Utilization', icon: 'PieChart', group: 'Analytics & Intelligence' },
    { name: 'Resource Dashboard', icon: 'Gauge', group: 'Analytics & Intelligence' },
    { name: 'Reports', icon: 'FileBarChart', group: 'Analytics & Intelligence' },
    { name: 'Notifications', icon: 'Bell', group: 'Governance & Security' },
    { name: 'Administration', icon: 'Sliders', group: 'Governance & Security' },
    { name: 'Audit Logs', icon: 'ShieldCheck', group: 'Governance & Security' },
  ],
  'Delivery Head': [
    { name: 'Dashboard', icon: 'LayoutDashboard', group: 'Overview' },
    { name: 'Employees', icon: 'Users', group: 'Workforce Master' },
    { name: 'Skills', icon: 'Boxes', group: 'Workforce Master' },
    { name: 'Certifications', icon: 'Award', group: 'Workforce Master' },
    { name: 'Clients', icon: 'Building2', group: 'Project Management' },
    { name: 'Projects', icon: 'FolderKanban', group: 'Project Management' },
    { name: 'Project Resource Structure', icon: 'Grid3X3', group: 'Project Management' },
    { name: 'Project Teams', icon: 'UsersRound', group: 'Project Management' },
    { name: 'Timesheets', icon: 'Clock', group: 'Allocations & Demand' },
    { name: 'Resource Requests', icon: 'FileText', group: 'Allocations & Demand' },
    { name: 'Resource Allocation', icon: 'CalendarDays', group: 'Allocations & Demand' },
    { name: 'Bench Resources', icon: 'Hourglass', group: 'Allocations & Demand' },
    { name: 'Resource Availability', icon: 'CalendarClock', group: 'Allocations & Demand' },
    { name: 'Utilization', icon: 'PieChart', group: 'Analytics & Intelligence' },
    { name: 'Resource Dashboard', icon: 'Gauge', group: 'Analytics & Intelligence' },
    { name: 'Reports', icon: 'FileBarChart', group: 'Analytics & Intelligence' },
    { name: 'Notifications', icon: 'Bell', group: 'Governance & Security' },
    { name: 'Administration', icon: 'Sliders', group: 'Governance & Security' },
    { name: 'Audit Logs', icon: 'ShieldCheck', group: 'Governance & Security' },
  ],
  'Project Manager': [
    { name: 'Dashboard', icon: 'LayoutDashboard', group: 'Overview' },
    { name: 'My Projects', icon: 'FolderKanban', group: 'My Deliveries' },
    { name: 'Project Structure', icon: 'Grid3X3', group: 'My Deliveries' },
    { name: 'My Project Team', icon: 'UsersRound', group: 'My Deliveries' },
    { name: 'Timesheets', icon: 'Clock', group: 'My Deliveries' },
    { name: 'Add Resource', icon: 'UserPlus', group: 'Staffing Actions' },
    { name: 'Resource Availability', icon: 'CalendarClock', group: 'Staffing Actions' },
    { name: 'Resource Requests', icon: 'FileText', group: 'Staffing Actions' },
    { name: 'Resource Sharing Requests', icon: 'ArrowLeftRight', group: 'Cross-Project Collaboration' },
    { name: 'Utilization', icon: 'PieChart', group: 'Insights' },
    { name: 'Notifications', icon: 'Bell', group: 'Insights' },
  ],
  'HR': [
    { name: 'Dashboard', icon: 'LayoutDashboard', group: 'Overview' },
    { name: 'Employees', icon: 'Users', group: 'People & Skills' },
    { name: 'Skills', icon: 'Boxes', group: 'People & Skills' },
    { name: 'Certifications', icon: 'Award', group: 'People & Skills' },
    { name: 'Resource Availability', icon: 'CalendarClock', group: 'Capacity & Bench' },
    { name: 'Bench Resources', icon: 'Hourglass', group: 'Capacity & Bench' },
    { name: 'Resource Requests', icon: 'FileText', group: 'Fulfillment Queue' },
    { name: 'Utilization', icon: 'PieChart', group: 'Analytics' },
    { name: 'Reports', icon: 'FileBarChart', group: 'Analytics' },
    { name: 'Notifications', icon: 'Bell', group: 'Analytics' },
  ]
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('resourcehub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [rememberedEmail, setRememberedEmail] = useState(() => {
    return localStorage.getItem('resourcehub_remembered_email') || '';
  });

  const [activeRecovery, setActiveRecovery] = useState(null);

  const login = async (email, password, rememberMe = false) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const cleanEmail = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === cleanEmail
    );

    if (!account) {
      throw new Error('Account not found with this enterprise email address.');
    }

    if (account.password !== password) {
      throw new Error('Invalid credentials. Please verify your password.');
    }

    setCurrentUser(account);
    localStorage.setItem('resourcehub_user', JSON.stringify(account));

    if (rememberMe) {
      localStorage.setItem('resourcehub_remembered_email', cleanEmail);
      setRememberedEmail(cleanEmail);
    } else {
      localStorage.removeItem('resourcehub_remembered_email');
      setRememberedEmail('');
    }

    return account;
  };

  const switchRole = (newRoleName) => {
    const targetAccount = DEMO_ACCOUNTS.find(acc => acc.role === newRoleName);
    if (targetAccount) {
      setCurrentUser(targetAccount);
      localStorage.setItem('resourcehub_user', JSON.stringify(targetAccount));
    }
  };

  const updateProfile = async (updatedFields) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('resourcehub_user', JSON.stringify(updated));

    // Update in DEMO_ACCOUNTS array
    const idx = DEMO_ACCOUNTS.findIndex(acc => acc.id === updated.id);
    if (idx !== -1) {
      DEMO_ACCOUNTS[idx] = updated;
    }
    return updated;
  };

  const changePassword = async (currentPassword, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (currentUser.password !== currentPassword) {
      throw new Error('Current password does not match.');
    }

    currentUser.password = newPassword;
    setCurrentUser({ ...currentUser });
    localStorage.setItem('resourcehub_user', JSON.stringify(currentUser));

    const idx = DEMO_ACCOUNTS.findIndex(acc => acc.id === currentUser.id);
    if (idx !== -1) {
      DEMO_ACCOUNTS[idx].password = newPassword;
    }
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('resourcehub_user');
  };

  const requestPasswordReset = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const cleanEmail = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === cleanEmail);

    if (!account) {
      throw new Error('No registered enterprise account found with this email.');
    }

    const generatedOtp = '123456';
    setActiveRecovery({
      email: cleanEmail,
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    return {
      success: true,
      message: 'Verification code sent to your enterprise inbox.',
      demoOtp: generatedOtp
    };
  };

  const verifyOTP = async (email, inputOtp) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (!activeRecovery || activeRecovery.email !== email.trim().toLowerCase()) {
      throw new Error('No active recovery session. Please request a new code.');
    }

    if (activeRecovery.otp !== inputOtp.trim()) {
      throw new Error('Invalid verification code. Please check and try again.');
    }

    return true;
  };

  const confirmPasswordReset = async (email, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cleanEmail = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === cleanEmail);
    
    if (account) {
      account.password = newPassword;
    }
    setActiveRecovery(null);
    return { success: true, message: 'Password has been updated successfully.' };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      rememberedEmail,
      login,
      logout,
      switchRole,
      updateProfile,
      changePassword,
      requestPasswordReset,
      verifyOTP,
      confirmPasswordReset,
      roleNavigation: ROLE_NAVIGATION[currentUser?.role] || ROLE_NAVIGATION['System Admin'],
      demoAccounts: DEMO_ACCOUNTS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
