import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ currentView, onNavigate, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      
      {/* Dynamic RBAC Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Viewport */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'ml-[76px]' : 'ml-[260px]'
      }`}>
        
        {/* Sticky Top Navbar */}
        <Navbar
          currentView={currentView}
          onNavigate={onNavigate}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1500px] w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
