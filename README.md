# 🏢 ResourceHub — Internal Project & Resource Management System

[![Deploy to GitHub Pages](https://github.com/akshay336/resource-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/akshay336/resource-hub/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat&logo=github)](https://akshay336.github.io/resource-hub/)

A modern, full-featured enterprise **Project & Resource Management Platform** designed to streamline workforce planning, resource allocation, project governance, and utilization analytics across cross-functional teams.

---

## 🚀 Live Demo

Access the live application hosted on GitHub Pages:
👉 **[https://akshay336.github.io/resource-hub/](https://akshay336.github.io/resource-hub/)**

---

## ✨ Key Features

- 🔐 **Multi-Role Access Control (RBAC)**
  - **System Admin**: Complete platform oversight, user management, audit logs, and system configurations.
  - **Delivery Head**: Strategic delivery metrics, organization-wide capacity planning, and resource blueprinting.
  - **Project Manager**: Project-specific tracking, team gap analysis, direct allocation, and resource sharing requests.
  - **HR / Talent Acquisition**: Talent bench monitoring, onboarding, skill inventory, and hiring pipelines.

- 📊 **Real-Time Analytics & Utilization**
  - Interactive charts powered by Recharts (allocation distribution, billability rates, department headcounts).
  - Bench vs. Active allocation tracking with threshold indicators.

- 👥 **Resource Blueprinting & Allocation**
  - Searchable employee directory with filterable skill matrices, experience levels, and availability.
  - Dynamic resource sharing and allocation request workflows.

- 🎨 **Enterprise UI/UX**
  - Responsive design with Tailwind CSS.
  - Dark / Light accent states and intuitive card layouts.
  - Role switcher and instant demo credentials for rapid testing.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6
- **Styling**: Tailwind CSS, PostCSS, Lucide React Icons
- **Charts & Visualizations**: Recharts
- **Deployment**: GitHub Pages via GitHub Actions CI/CD

---

## ⚡ Quick Start / Local Development

### 1. Clone the repository
```bash
git clone https://github.com/akshay336/resource-hub.git
cd resource-hub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🔑 Demo Login Credentials

For quick evaluation, click on the pre-filled demo accounts on the login screen or use:

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@resourcehub.corp` | `Password@123` |
| **Delivery Head** | `dh.verma@resourcehub.corp` | `Password@123` |
| **Project Manager** | `pm.rao@resourcehub.corp` | `Password@123` |
| **HR Manager** | `hr.nair@resourcehub.corp` | `Password@123` |

---

## 📄 License

This project is licensed under the MIT License.
