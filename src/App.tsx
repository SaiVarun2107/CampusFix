import { useState, useEffect, useCallback } from 'react';
import type { User, Issue, UserRole, NotificationItem } from './types';
import { apiService } from './services/apiService';
import { getStoredNotifications, saveNotificationsToStorage, saveUserToStorage } from './services/storageService';
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
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());
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

  // Notifications Helpers
  const addNotification = (newNotif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: NotificationItem = {
      ...newNotif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => {
      const updated = [item, ...prev];
      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  const handleMarkAllNotificationsRead = (role: UserRole, userId?: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => {
        if (n.targetRole === role && (!n.targetUserId || n.targetUserId === userId || n.targetUserId === 'user_student_1')) {
          return { ...n, read: true };
        }
        return n;
      });
      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  // Handle Full User Profile Update (Settings Edit Mode & Database Sync)
  const handleUpdateUserProfile = async (updatedFields: Partial<User>) => {
    if (!currentUser) return;
    const mergedUser: User = { ...currentUser, ...updatedFields };

    // 1. Sync to TiDB Database via API
    try {
      await apiService.updateUserProfile(currentUser.id, updatedFields);
    } catch (e) {
      console.warn('API profile update failed, using local update:', e);
    }

    // 2. Update React State & LocalStorage
    setCurrentUser(mergedUser);
    saveUserToStorage(mergedUser);

    // 3. Update reporter name/dept in active issues list
    setIssues(prev => prev.map(issue => {
      if (issue.reporter?.id === currentUser.id || (issue.reporter?.email && issue.reporter.email.toLowerCase() === currentUser.email.toLowerCase())) {
        return {
          ...issue,
          reporter: {
            ...issue.reporter,
            name: mergedUser.name,
            department: mergedUser.department || issue.reporter.department
          }
        };
      }
      return issue;
    }));
  };

  // Handle reporting new issue (Student) -> TiDB Cloud & Local Persistence
  const handleCreateIssue = async (issueData: Omit<Issue, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'activityLog' | 'progressPercent' | 'adminApproval'>) => {
    const payload = {
      title: issueData.title,
      category: issueData.category,
      location: issueData.location,
      description: issueData.description,
      priority: issueData.priority,
      attachmentUrl: issueData.attachmentUrl,
      reporterId: issueData.reporter.id,
      reporterName: issueData.reporter.name,
      reporterEmail: issueData.reporter.email,
      reporterDept: issueData.reporter.department
    };

    try {
      const newIssue = await apiService.createIssue(payload);
      setIssues(prev => [newIssue, ...prev.filter(i => i.id !== newIssue.id)]);

      // Notify Staff about new issue
      addNotification({
        targetRole: 'staff',
        title: '📢 New Issue Reported',
        message: `New report ${newIssue.ticketNumber} (${newIssue.title}) submitted by ${newIssue.reporter.name} at ${newIssue.location.block}.`,
        issueId: newIssue.id,
        ticketNumber: newIssue.ticketNumber,
        type: 'report'
      });

      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
    } catch (err: any) {
      console.error('Error submitting issue:', err);
      await refreshIssues();
    }
  };

  // Handle staff requesting admin approval -> TiDB Cloud
  const handleRequestApproval = async (issueId: string) => {
    if (!currentUser) return;
    try {
      await apiService.requestApproval(issueId, currentUser.id, currentUser.name);
    } catch (err: any) {
      console.error('Error requesting approval:', err);
    }
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: 'Pending Approval',
          assignedStaff: issue.assignedStaff || {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            department: currentUser.department || 'Facilities'
          },
          adminApproval: {
            ...issue.adminApproval,
            requested: true,
            requestedAt: new Date().toISOString(),
            requestedByStaffId: currentUser.id,
            requestedByStaffName: currentUser.name
          },
          activityLog: [
            {
              id: `act-${Date.now()}`,
              text: `Staff (${currentUser.name}) requested Admin work approval`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actor: currentUser.name,
              actorRole: 'staff'
            },
            ...issue.activityLog
          ]
        };
      }
      return issue;
    }));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, status: 'Pending Approval' } : null);
    }
  };

  // Handle admin granting approval -> TiDB Cloud
  const handleApproveWork = async (issueId: string, comment: string) => {
    if (!currentUser) return;
    const targetIssue = issues.find(i => i.id === issueId);
    try {
      await apiService.approveWork(issueId, currentUser.name, comment || 'Approved by Admin');
    } catch (err: any) {
      console.error('Error approving work:', err);
    }

    // Trigger Notification exclusively for Staff (Students are NOT notified about internal admin work approvals)
    addNotification({
      targetRole: 'staff',
      title: '🛡️ Admin Work Approval Granted',
      message: `Admin (${currentUser.name}) APPROVED work for ${targetIssue?.ticketNumber || 'ticket'}: "${comment || 'Approved'}"`,
      issueId,
      ticketNumber: targetIssue?.ticketNumber || '#CF',
      type: 'approval'
    });

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: 'In Progress',
          progressPercent: Math.max(issue.progressPercent, 25),
          adminApproval: {
            ...issue.adminApproval,
            approved: true,
            approvedAt: new Date().toISOString(),
            approvedByAdminName: currentUser.name,
            adminComment: comment || 'Approved by Admin'
          },
          activityLog: [
            {
              id: `act-${Date.now()}`,
              text: `Admin (${currentUser.name}) APPROVED work: "${comment || 'Approved'}"`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actor: currentUser.name,
              actorRole: 'admin'
            },
            ...issue.activityLog
          ]
        };
      }
      return issue;
    }));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, status: 'In Progress', progressPercent: Math.max(prev.progressPercent, 25) } : null);
    }
  };

  // Handle staff updating progress & marking resolved -> TiDB Cloud
  const handleUpdateProgress = async (issueId: string, progress: number, notes: string) => {
    if (!currentUser) return;
    const targetIssue = issues.find(i => i.id === issueId);
    try {
      await apiService.updateProgress(issueId, currentUser.name, progress, notes || 'Progress updated');
    } catch (err: any) {
      console.error('Error updating progress:', err);
    }
    const isResolved = progress >= 100;

    // Trigger Notifications for Student
    if (targetIssue?.reporter) {
      if (isResolved) {
        addNotification({
          targetRole: 'student',
          targetUserId: targetIssue.reporter.id,
          title: '🎉 Issue Resolved!',
          message: `Your reported issue ${targetIssue.ticketNumber} (${targetIssue.title}) has been marked fully resolved (100%). ${notes ? `Notes: ${notes}` : ''}`,
          issueId,
          ticketNumber: targetIssue.ticketNumber,
          type: 'resolved'
        });
      } else {
        addNotification({
          targetRole: 'student',
          targetUserId: targetIssue.reporter.id,
          title: `🔧 Progress Updated (${progress}%)`,
          message: `Work progress on your report ${targetIssue.ticketNumber} (${targetIssue.title}) updated to ${progress}%. ${notes ? `Notes: ${notes}` : ''}`,
          issueId,
          ticketNumber: targetIssue.ticketNumber,
          type: 'progress'
        });
      }
    }

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: isResolved ? 'Resolved' : 'In Progress',
          progressPercent: progress,
          resolutionNotes: isResolved ? (notes || 'Issue fixed completely.') : issue.resolutionNotes,
          activityLog: [
            {
              id: `act-${Date.now()}`,
              text: isResolved ? `Issue RESOLVED by ${currentUser.name}: ${notes || 'Fixed'}` : `Progress updated to ${progress}%: ${notes || 'Updated'}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actor: currentUser.name,
              actorRole: 'staff'
            },
            ...issue.activityLog
          ]
        };
      }
      return issue;
    }));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, status: isResolved ? 'Resolved' : 'In Progress', progressPercent: progress } : null);
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
            notifications={notifications}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentPage('landing');
            }}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          />
        )}

        {currentPage === 'staff-dashboard' && currentUser && (
          <StaffDashboard
            currentUser={currentUser}
            issues={issues}
            notifications={notifications}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onRequestApproval={handleRequestApproval}
            onUpdateProgress={handleUpdateProgress}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentPage('landing');
            }}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          />
        )}

        {currentPage === 'admin-dashboard' && currentUser && (
          <AdminDashboard
            currentUser={currentUser}
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onApproveWork={handleApproveWork}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentPage('landing');
            }}
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
            onUpdateProfile={handleUpdateUserProfile}
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

