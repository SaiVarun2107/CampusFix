import React, { useState } from 'react';
import { 
  LayoutDashboard, AlertCircle, LogOut, Settings,
  Plus, Bell, CheckCircle2, Wrench, Eye, User as UserIcon
} from 'lucide-react';
import type { Issue, User, NotificationItem, UserRole } from '../types';

interface StudentDashboardProps {
  currentUser: User;
  issues: Issue[];
  notifications: NotificationItem[];
  onOpenReportModal: () => void;
  onSelectIssue: (issue: Issue) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: (role: UserRole, userId?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  issues,
  notifications = [],
  onOpenReportModal,
  onSelectIssue,
  onOpenSettings,
  onLogout,
  onMarkNotificationRead,
  onMarkAllNotificationsRead
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-issues' | 'solved-issues'>('dashboard');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'progress'>('newest');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Filter issues belonging to the current student by ID, Email, or Name match
  const studentIssues = issues.filter(
    i => i.reporter?.id === currentUser.id ||
         (i.reporter?.email && currentUser.email && i.reporter.email.toLowerCase() === currentUser.email.toLowerCase()) ||
         (i.reporter?.name && currentUser.name && i.reporter.name.toLowerCase() === currentUser.name.toLowerCase())
  );

  const activeIssues = studentIssues.filter(i => i.status !== 'Resolved');
  const solvedIssues = studentIssues.filter(i => i.status === 'Resolved');

  const targetList = activeTab === 'solved-issues' ? solvedIssues : activeTab === 'my-issues' ? activeIssues : studentIssues;

  const filteredIssues = targetList
    .filter(i => {
      const matchesCat = categoryFilter === 'all' || i.category === categoryFilter;
      const matchesPrio = priorityFilter === 'all' || i.priority === priorityFilter;
      const matchesStat = statusFilter === 'all' || i.status === statusFilter;

      return matchesCat && matchesPrio && matchesStat;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'priority') {
        const pMap: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      if (sortBy === 'progress') return b.progressPercent - a.progressPercent;
      return 0;
    });

  const stats = {
    total: studentIssues.length,
    pending: studentIssues.filter(i => i.status === 'Pending').length,
    inProgress: studentIssues.filter(i => i.status === 'In Progress' || i.status === 'Pending Approval').length,
    resolved: solvedIssues.length
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#111827',
        color: '#9ca3af',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 24px 8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#0066ff',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wrench size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                CampusFix
              </h3>
              <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Facility Management</span>
            </div>
          </div>

          {/* Report New Issue Button */}
          <button
            onClick={onOpenReportModal}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.875rem',
              marginBottom: '28px',
              boxShadow: '0 4px 14px rgba(0, 102, 255, 0.3)'
            }}
          >
            <Plus size={18} /> Report New Issue
          </button>

          {/* Sidebar Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'dashboard' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                backgroundColor: activeTab === 'dashboard' ? '#1f2937' : 'transparent',
                color: activeTab === 'dashboard' ? '#ffffff' : '#9ca3af',
                borderLeft: activeTab === 'dashboard' ? '3px solid #0066ff' : '3px solid transparent'
              }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('my-issues')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'my-issues' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                backgroundColor: activeTab === 'my-issues' ? '#1f2937' : 'transparent',
                color: activeTab === 'my-issues' ? '#ffffff' : '#9ca3af',
                borderLeft: activeTab === 'my-issues' ? '3px solid #0066ff' : '3px solid transparent'
              }}
            >
              <AlertCircle size={18} /> Active Issues ({activeIssues.length})
            </button>

            <button
              onClick={() => setActiveTab('solved-issues')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'solved-issues' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                backgroundColor: activeTab === 'solved-issues' ? '#1f2937' : 'transparent',
                color: activeTab === 'solved-issues' ? '#ffffff' : '#9ca3af',
                borderLeft: activeTab === 'solved-issues' ? '3px solid #0066ff' : '3px solid transparent'
              }}
            >
              <CheckCircle2 size={18} /> Solved Archive ({solvedIssues.length})
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Settings directly above Logout */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onOpenSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1f2937',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Settings size={18} color="#0066ff" /> Settings & Details
          </button>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'none',
              color: '#9ca3af',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: '24px 32px' }}>
        {/* Top Header - No Search bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '20px',
          flexShrink: 0
        }}>
          {/* User profile & Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            {/* Interactive Bell Icon button */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsNotifOpen(prev => !prev)}
                style={{ 
                  background: isNotifOpen ? '#eff6ff' : '#ffffff', 
                  border: isNotifOpen ? '2px solid #0066ff' : '1px solid #e2e8f0', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: isNotifOpen ? '#0066ff' : '#64748b', 
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title="Notifications"
              >
                <Bell size={19} />
                {notifications.filter(n => n.targetRole === 'student' && (!n.targetUserId || n.targetUserId === currentUser.id || n.targetUserId === 'user_student_1') && !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                  }}>
                    {notifications.filter(n => n.targetRole === 'student' && (!n.targetUserId || n.targetUserId === currentUser.id || n.targetUserId === 'user_student_1') && !n.read).length}
                  </span>
                )}
              </button>

              {/* Floating Notifications Dropdown */}
              {isNotifOpen && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: '0',
                  width: '360px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e2e8f0',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  {/* Dropdown Header */}
                  <div style={{
                    padding: '14px 18px',
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bell size={16} color="#0066ff" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Issue Updates</span>
                    </div>
                    {onMarkAllNotificationsRead && (
                      <button
                        onClick={() => onMarkAllNotificationsRead('student', currentUser.id)}
                        style={{ background: 'none', border: 'none', color: '#0066ff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {notifications.filter(n => n.targetRole === 'student' && (!n.targetUserId || n.targetUserId === currentUser.id || n.targetUserId === 'user_student_1')).length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications
                        .filter(n => n.targetRole === 'student' && (!n.targetUserId || n.targetUserId === currentUser.id || n.targetUserId === 'user_student_1'))
                        .map((notif) => {
                          const matchingIssue = issues.find(i => i.id === notif.issueId || i.ticketNumber === notif.ticketNumber);
                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                if (onMarkNotificationRead) onMarkNotificationRead(notif.id);
                                if (matchingIssue) onSelectIssue(matchingIssue);
                                setIsNotifOpen(false);
                              }}
                              style={{
                                padding: '14px 16px',
                                borderBottom: '1px solid #f1f5f9',
                                backgroundColor: notif.read ? '#ffffff' : '#f0f7ff',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                gap: '12px'
                              }}
                            >
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: notif.type === 'resolved' ? '#dcfce7' : notif.type === 'approval' ? '#f3e8ff' : '#dbeafe',
                                color: notif.type === 'resolved' ? '#16a34a' : notif.type === 'approval' ? '#7e22ce' : '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                fontSize: '0.9rem',
                                paddingLeft: '8px',
                                paddingTop: '4px'
                              }}>
                                {notif.type === 'resolved' ? '🎉' : notif.type === 'approval' ? '🛡️' : '🔧'}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                    {notif.title}
                                  </h4>
                                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{notif.timestamp}</span>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                                  {notif.message}
                                </p>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div 
              onClick={onOpenSettings}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              title="Click to view Settings"
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#0066ff',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                <UserIcon size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.name}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{currentUser.vtuNo || 'Student'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Header Section (Greeting + Stats) */}
        <div style={{ flexShrink: 0 }}>
          {/* Welcome Greeting */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Good morning, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Here's the status of your reported campus infrastructure issues.
            </p>
          </div>

          {/* 4 Counter Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
            marginBottom: '20px'
          }}>
            {/* Card 1: TOTAL ISSUES */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                MY REPORTED ISSUES
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {stats.total}
              </div>
            </div>

            {/* Card 2: PENDING */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c2410c', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⏳ PENDING
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c2410c', marginTop: '2px' }}>
                {stats.pending}
              </div>
            </div>

            {/* Card 3: IN PROGRESS */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔧 IN PROGRESS
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>
                {stats.inProgress}
              </div>
            </div>

            {/* Card 4: RESOLVED */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✓ RESOLVED
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {stats.resolved}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Issues List Section */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '4px' }}>
          {/* Dashboard Grid: Recent Issues (Left) + Updates Feed (Right) */}
          {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            {/* Left: Recent Issues Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  My Recent Reported Issues
                </h3>
                <button
                  onClick={() => setActiveTab('my-issues')}
                  style={{ background: 'none', border: 'none', color: '#0066ff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  View All →
                </button>
              </div>

              {filteredIssues.length === 0 ? (
                <div className="card" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  You have not reported any issues yet. Click "+ Report New Issue" to get started!
                </div>
              ) : (
                filteredIssues.slice(0, 4).map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderRadius: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: issue.category.includes('IT') ? '#eff6ff' : issue.category.includes('Plumbing') ? '#e0f2fe' : '#fef3c7',
                        color: issue.category.includes('IT') ? '#1d4ed8' : issue.category.includes('Plumbing') ? '#0284c7' : '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Wrench size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                          {issue.title}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                          📍 {issue.location.block} • {issue.location.room}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
                          Updated {issue.updatedAt.includes('T') ? 'Recently' : issue.updatedAt}
                        </span>
                      </div>
                    </div>

                    <div>
                      {issue.status === 'In Progress' && <span className="badge badge-in-progress">In Progress</span>}
                      {issue.status === 'Pending' && <span className="badge badge-pending">Pending</span>}
                      {issue.status === 'Pending Approval' && <span className="badge badge-approval">Awaiting Approval</span>}
                      {issue.status === 'Resolved' && <span className="badge badge-resolved">Resolved</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Updates Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '18px', color: '#0f172a' }}>
                  Real-time Updates Feed
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {filteredIssues.length === 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No active updates yet.</span>
                  ) : (
                    filteredIssues.slice(0, 3).map((issue) => (
                      <div key={issue.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: issue.status === 'Resolved' ? '#10b981' : '#0066ff', marginTop: '6px', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                            Report <b>{issue.ticketNumber}</b> ({issue.title}): status is <b>{issue.status}</b>.
                          </p>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recently updated</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Issues & Solved Issues Tabs */}
        {(activeTab === 'my-issues' || activeTab === 'solved-issues') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                {activeTab === 'solved-issues' ? 'Previously Solved Issues (Archive)' : 'My Active Reported Issues'}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Showing {filteredIssues.length} issues
              </span>
            </div>

            {/* Filter & Sort Controls Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              {/* Left Group: Category + Priority + Status Filter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {/* Category Dropdown */}
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px', minWidth: '140px', borderRadius: '6px' }}
                >
                  <option value="all">All Categories</option>
                  <option value="IT & AV Equipment">IT & AV Equipment</option>
                  <option value="Plumbing & Water">Plumbing & Water</option>
                  <option value="Electrical & Lighting">Electrical & Lighting</option>
                  <option value="HVAC & Cooling">HVAC & Cooling</option>
                  <option value="Furniture & Carpentry">Furniture & Carpentry</option>
                  <option value="Campus Infrastructure">Campus Infrastructure</option>
                </select>

                {/* Priority Dropdown */}
                <select
                  className="form-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px', width: '120px', borderRadius: '6px' }}
                >
                  <option value="all">All Priorities</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {/* Status Dropdown (only for active issues) */}
                {activeTab !== 'solved-issues' && (
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px', width: '130px', borderRadius: '6px' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending Approval">Awaiting Approval</option>
                  </select>
                )}
              </div>

              {/* Right Group: Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>Sort By:</span>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px', width: '140px', fontWeight: 700, color: '#0066ff', borderRadius: '6px' }}
                >
                  <option value="newest">🕒 Newest First</option>
                  <option value="oldest">⏳ Oldest First</option>
                  <option value="priority">⚡ Priority (High → Low)</option>
                  <option value="progress">📊 Progress %</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredIssues.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  No issues found in this view.
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className="card"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wrench size={22} color="#64748b" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                            {issue.ticketNumber}
                          </span>
                          <span className={`priority-pill priority-${issue.priority.toLowerCase()}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                          {issue.title}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          📍 {issue.location.block} • {issue.location.floor} • {issue.location.room}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      {/* Progress Bar preview */}
                      <div style={{ width: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '2px' }}>
                          <span>Progress</span>
                          <span>{issue.progressPercent}%</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${issue.progressPercent}%`, height: '100%', backgroundColor: issue.status === 'Resolved' ? '#10b981' : '#0066ff' }} />
                        </div>
                      </div>

                      <div>
                        {issue.status === 'In Progress' && <span className="badge badge-in-progress">In Progress</span>}
                        {issue.status === 'Pending' && <span className="badge badge-pending">Pending</span>}
                        {issue.status === 'Pending Approval' && <span className="badge badge-approval">Awaiting Approval</span>}
                        {issue.status === 'Resolved' && <span className="badge badge-resolved">Resolved</span>}
                      </div>

                      <Eye size={18} color="#94a3b8" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};
