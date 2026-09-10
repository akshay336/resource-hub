import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';
import EmployeesPage from './EmployeesPage';
import SkillsPage from './SkillsPage';
import CertificationsPage from './CertificationsPage';
import ClientsPage from './ClientsPage';
import ProjectsPage from './ProjectsPage';
import ProjectStructurePage from './ProjectStructurePage';
import ProjectTeamsPage from './ProjectTeamsPage';
import MyProjectsPage from './MyProjectsPage';
import MyProjectTeamPage from './MyProjectTeamPage';
import AddResourcePage from './AddResourcePage';
import SharingRequestsPage from './SharingRequestsPage';
import ResourceRequestsPage from './ResourceRequestsPage';
import ResourceDashboardPage from './ResourceDashboardPage';
import BenchResourcesPage from './BenchResourcesPage';
import ResourceAvailabilityPage from './ResourceAvailabilityPage';
import UtilizationPage from './UtilizationPage';
import ReportsPage from './ReportsPage';
import AuditLogsPage from './AuditLogsPage';
import NotificationsPage from './NotificationsPage';
import AdministrationPage from './AdministrationPage';
import ErrorBoundary from '../components/common/ErrorBoundary';
import PlaceholderView from './PlaceholderView';

export default function AuthenticatedApp() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('Dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ001');
  const [selectedDemandId, setSelectedDemandId] = useState('DEM-01');

  const renderViewContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardPage onNavigate={setCurrentView} />;
      case 'Profile':
        return <ProfilePage />;
      case 'Employees':
        return <EmployeesPage />;
      case 'Skills':
        return <SkillsPage />;
      case 'Certifications':
        return <CertificationsPage />;
      case 'Clients':
        return <ClientsPage />;
      case 'Projects':
        return (
          <ProjectsPage 
            onNavigateToStructure={(projId) => {
              setSelectedProjectId(projId);
              setCurrentView('Project Resource Structure');
            }} 
          />
        );
      case 'Project Resource Structure':
        return (
          <ProjectStructurePage 
            defaultProjectId={selectedProjectId}
            onNavigateToAddResource={() => setCurrentView('Add Resource')}
          />
        );
      case 'Project Structure':
        return (
          <ProjectStructurePage 
            defaultProjectId={selectedProjectId}
            pmOnly={true}
            onNavigateToAddResource={() => setCurrentView('Add Resource')}
          />
        );
      case 'Project Teams':
        return <ProjectTeamsPage />;
      case 'My Projects':
        return (
          <MyProjectsPage 
            onNavigateToStructure={(projId) => {
              setSelectedProjectId(projId);
              setCurrentView('Project Structure');
            }}
            onNavigateToTeam={() => setCurrentView('My Project Team')}
          />
        );
      case 'My Project Team':
        return (
          <MyProjectTeamPage 
            onNavigateToAddResource={() => setCurrentView('Add Resource')}
            onNavigateToSharingRequests={() => setCurrentView('Resource Sharing Requests')}
          />
        );
      case 'Add Resource':
        return (
          <AddResourcePage 
            onNavigateToSharing={(cand) => setCurrentView('Resource Sharing Requests')}
            onNavigateToTeam={() => setCurrentView(currentUser.role === 'Project Manager' ? 'My Project Team' : 'Project Teams')}
          />
        );
      case 'Resource Sharing Requests':
        return <SharingRequestsPage />;
      case 'Resource Requests':
        return (
          <ResourceRequestsPage 
            onNavigateToDashboard={(demandId) => {
              if (demandId) setSelectedDemandId(demandId);
              setCurrentView('Resource Dashboard');
            }}
          />
        );
      case 'Resource Allocation':
        return <ProjectTeamsPage />;
      case 'Bench Resources':
        return (
          <BenchResourcesPage 
            onNavigateToAddResource={() => setCurrentView('Add Resource')}
            onNavigateToMatching={() => setCurrentView('Resource Dashboard')}
          />
        );
      case 'Resource Availability':
        return (
          <ResourceAvailabilityPage 
            onNavigateToAddResource={() => setCurrentView('Add Resource')}
          />
        );
      case 'Utilization':
        return <UtilizationPage onNavigate={setCurrentView} />;
      case 'Resource Dashboard':
        return (
          <ResourceDashboardPage 
            initialDemandId={selectedDemandId}
            onNavigateToRequests={() => setCurrentView('Resource Requests')}
            onNavigateToAddResource={() => setCurrentView('Add Resource')}
          />
        );
      case 'Reports':
        return <ReportsPage />;
      case 'Audit Logs':
        return <AuditLogsPage />;
      case 'Notifications':
        return <NotificationsPage onNavigate={setCurrentView} />;
      case 'Administration':
        return <AdministrationPage />;
      default:
        return <PlaceholderView viewName={currentView} onNavigate={setCurrentView} />;
    }
  };

  return (
    <AppLayout currentView={currentView} onNavigate={setCurrentView}>
      <ErrorBoundary onReset={() => setCurrentView('Dashboard')}>
        {renderViewContent()}
      </ErrorBoundary>
    </AppLayout>
  );
}
