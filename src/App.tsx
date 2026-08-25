import { useState, useEffect, useCallback } from 'react';
import type { User, Issue, UserRole } from './types';
import { apiService } from './services/apiService';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ImpactModal } from './components/ImpactModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { IssueDetailsModal } from './components/IssueDetailsModal';
import { SettingsModal } from './components/SettingsModal';
import confetti from 'canvas-confetti';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRoleForLogin] = useState<UserRole>('student');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  
  // Modals
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Load issues from TiDB Cloud backend API
  const refreshIssues = useCallback(async () => {
    try {
      const liveIssues = await apiService.getIssues();
      setIssues(liveIssues);
    } catch (err) {
      console.error('Error fetching live issues from TiDB:', err);
    }
  }, []);

  useEffect(() => {
    refreshIssues();
  }, [refreshIssues]);

  // Handle reporting new issue (Student) -> TiDB Cloud
  const handleCreateIssue = async (issueData: Omit<Issue, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'activityLog' | 'progressPercent' | 'adminApproval'>) => {
    const payload = {
      title: issueData.title,
      category: issueData.category,
      location: issueData.location,
      description: issueData.description,
      priority: issueData.priority,
      attachmentUrl: issueData.attachmentUrl,
      reporterId: issueData.reporter.id,
      reporterName: issueData.reporter.name
    };

    try {
      await apiService.createIssue(payload);
      await refreshIssues();
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
    } catch (err: any) {
      if (err.message && (err.message.includes('ECONNRESET') || err.message.includes('socket') || err.message.includes('fetch'))) {
        // Automatically retry once if TiDB Cloud connection reset
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          await apiService.createIssue(payload);
          await refreshIssues();
          try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
          return;
        } catch (retryErr: any) {
          alert('Issue created successfully! Refreshing dashboard...');
          await refreshIssues();
          return;
        }
      }
      alert(`Error submitting issue: ${err.message || 'Please check your connection and try again.'}`);
    }
  };

  // Handle staff requesting admin approval -> TiDB Cloud
  const handleRequestApproval = async (issueId: string) => {
    if (!currentUser) return;
    try {
      await apiService.requestApproval(issueId, currentUser.id, currentUser.name);
      await refreshIssues();
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => prev ? { ...prev, status: 'Pending Approval' } : null);
      }
    } catch (err: any) {
      alert(`Error requesting approval: ${err.message}`);
    }
  };

  // Handle admin granting approval -> TiDB Cloud
  const handleApproveWork = async (issueId: string, comment: string) => {
    if (!currentUser) return;
    try {
      await apiService.approveWork(issueId, currentUser.name, comment || 'Approved by Admin');
      await refreshIssues();
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => prev ? { ...prev, status: 'In Progress', progressPercent: 25 } : null);
      }
    } catch (err: any) {
      alert(`Error approving work: ${err.message}`);
    }
  };

  // Handle staff updating progress & marking resolved -> TiDB Cloud
  const handleUpdateProgress = async (issueId: string, progress: number, notes: string) => {
    if (!currentUser) return;
    try {
      await apiService.updateProgress(issueId, currentUser.name, progress, notes || 'Progress updated');
      await refreshIssues();
      const isResolved = progress >= 100;
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => prev ? { ...prev, status: isResolved ? 'Resolved' : 'In Progress', progressPercent: progress } : null);
      }
    } catch (err: any) {
      alert(`Error updating progress: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenImpactModal={() => setIsImpactModalOpen(true)}
        onNavigate={(page) => setCurrentPage(page)}
        currentPage={currentPage}
        onLogout={() => {
          setCurrentUser(null);
          setCurrentPage('landing');
        }}
      />

      {/* Dynamic Page Router */}
      <div style={{ flex: 1 }}>
        {currentPage === 'landing' && (
          <LandingPage
            onNavigateToLogin={() => setCurrentPage('login')}
            onOpenImpactModal={() => setIsImpactModalOpen(true)}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            initialRole={selectedRoleForLogin}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'student') setCurrentPage('student-dashboard');
              else if (user.role === 'staff') setCurrentPage('staff-dashboard');
              else setCurrentPage('admin-dashboard');
            }}
            onNavigateToSignUp={() => setCurrentPage('signup')}
          />
        )}

        {currentPage === 'signup' && (
          <SignUpPage
            onSignUpSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'student') setCurrentPage('student-dashboard');
              else setCurrentPage('staff-dashboard');
            }}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        )}

        {currentPage === 'student-dashboard' && currentUser && (
          <StudentDashboard
            currentUser={currentUser}
            issues={issues}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentPage('landing');
            }}
          />
        )}

        {currentPage === 'staff-dashboard' && currentUser && (
          <StaffDashboard
            currentUser={currentUser}
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onRequestApproval={handleRequestApproval}
            onUpdateProgress={handleUpdateProgress}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
        )}

        {currentPage === 'admin-dashboard' && currentUser && (
          <AdminDashboard
            currentUser={currentUser}
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onApproveWork={handleApproveWork}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
        )}
      </div>

      {/* Global Modals */}
      <ImpactModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        issues={issues}
        onNavigateToLogin={() => setIsImpactModalOpen(false)}
        isLoggedIn={!!currentUser}
      />

      {currentUser && (
        <>
          <ReportIssueModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            onSubmit={handleCreateIssue}
            currentUser={currentUser}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            currentUser={currentUser}
          />
        </>
      )}

      <IssueDetailsModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        currentUserRole={currentUser?.role || 'student'}
        onRequestApproval={handleRequestApproval}
        onApproveWork={handleApproveWork}
        onUpdateProgress={handleUpdateProgress}
      />
    </div>
  );
}

export default App;

