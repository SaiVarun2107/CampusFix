import React, { useState } from 'react';
import { 
  Wrench, Eye, Bell, ShieldCheck, LogOut, Menu, X
} from 'lucide-react';
import type { Issue, User, NotificationItem, UserRole } from '../types';

interface StaffDashboardProps {
  currentUser: User;
  issues: Issue[];
  notifications?: NotificationItem[];
  onSelectIssue: (issue: Issue) => void;
  onRequestApproval: (issueId: string) => void;
  onUpdateProgress: (issueId: string, progress: number, notes: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: (role: UserRole, userId?: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser: _currentUser,
  issues,
  notifications = [],
  onSelectIssue,
  onRequestApproval,
  onUpdateProgress,
  onOpenSettings,
  onLogout,
  onMarkNotificationRead,
  onMarkAllNotificationsRead
}) => {
  const [filterTab, setFilterTab] = useState<'dashboard' | 'all' | 'pending' | 'approval' | 'in-progress' | 'resolved'>('dashboard');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'progress'>('newest');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const staffNotifications = notifications.filter(n => n.targetRole === 'staff');
  const unreadCount = staffNotifications.filter(n => !n.read).length;

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    pendingApproval: issues.filter(i => i.status === 'Pending Approval').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length
  };

  const filteredIssues = issues
    .filter(issue => {
      if (filterTab === 'pending') return issue.status === 'Pending';
      if (filterTab === 'approval') return issue.status === 'Pending Approval';
      if (filterTab === 'in-progress') return issue.status === 'In Progress';
      if (filterTab === 'resolved') return issue.status === 'Resolved';
      return true;
    })
    .filter(i => {
      const matchesCat = categoryFilter === 'all' || i.category === categoryFilter;
      const matchesPrio = priorityFilter === 'all' || i.priority === priorityFilter;

      return matchesCat && matchesPrio;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'priority') {
        const pMap: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      if (sortBy === 'progress') return b.progressPercent - a.progressPercent;
      return 0;
    });

  return (
    <div className="staff-layout" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '24px 32px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Header Bar for Mobile Navigation & Notifications */}
      <div 
        className="mobile-top-header"
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: '#111827',
          color: '#ffffff',
          borderBottom: '1px solid #1f2937',
          margin: '-24px -32px 16px -32px',
          flexShrink: 0,
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            style={{
              background: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} color="#0066ff" />
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>Staff Portal</span>
          </div>
        </div>

        {/* Top Right Notification Bell Button */}
        <button
          onClick={() => setIsNotifOpen(prev => !prev)}
          style={{
            background: unreadCount > 0 ? '#7e22ce' : '#1f2937',
            color: '#ffffff',
            border: unreadCount > 0 ? '1px solid #a855f7' : '1px solid #374151',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Bell size={16} />
          <span>Approvals ({unreadCount})</span>
        </button>
      </div>

      {/* Top Right Notification Dropdown Panel */}
      {isNotifOpen && (
        <div 
          onClick={() => setIsNotifOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 290
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '56px',
              right: '12px',
              width: '340px',
              maxWidth: '92vw',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              zIndex: 300,
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#faf5ff',
              borderBottom: '1px solid #e9d5ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} color="#7e22ce" />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#7e22ce' }}>Admin Work Approvals</span>
              </div>
              {onMarkAllNotificationsRead && (
                <button
                  onClick={() => onMarkAllNotificationsRead('staff')}
                  style={{ background: 'none', border: 'none', color: '#7e22ce', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {staffNotifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  ✓ No pending notifications.
                </div>
              ) : (
                staffNotifications.map((notif) => {
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
                        backgroundColor: notif.read ? '#ffffff' : '#faf5ff',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#f3e8ff',
                        color: '#7e22ce',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '0.9rem'
                      }}>
                        🛡️
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
        </div>
      )}

      {/* Slide-In Mobile Left Drawer for Staff Portal */}
      {isMobileDrawerOpen && (
        <div 
          onClick={() => setIsMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 200,
            display: 'flex'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '285px',
              height: '100%',
              backgroundColor: '#111827',
              color: '#9ca3af',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px 20px',
              boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
              animation: 'slideDrawerIn 0.25s ease-out'
            }}
          >
            <div>
              {/* Drawer Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#0f766e',
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
                    <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Staff Operations</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation Options inside Mobile Drawer */}
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', marginBottom: '10px' }}>
                Navigation & Views
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { key: 'dashboard', label: '📊 Dashboard Overview' },
                  { key: 'all', label: `📋 All Operations (${stats.total})` },
                  { key: 'pending', label: `⏳ Pending Requests (${stats.pending})` },
                  { key: 'approval', label: `🛡️ Awaiting Admin (${stats.pendingApproval})` },
                  { key: 'in-progress', label: `🔧 Work In Progress (${stats.inProgress})` },
                  { key: 'resolved', label: `✓ Resolved Operations (${stats.resolved})` }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setFilterTab(tab.key as any); setIsMobileDrawerOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: filterTab === tab.key ? 700 : 500,
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      backgroundColor: filterTab === tab.key ? '#1f2937' : 'transparent',
                      color: filterTab === tab.key ? '#ffffff' : '#9ca3af',
                      borderLeft: filterTab === tab.key ? '3px solid #0f766e' : '3px solid transparent'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div style={{ borderTop: '1px solid #1f2937', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => { setIsMobileDrawerOpen(false); onOpenSettings(); }}
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
                <Eye size={18} color="#0f766e" /> Settings & Details
              </button>

              <button
                onClick={() => { setIsMobileDrawerOpen(false); onLogout(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'none',
                  color: '#ef4444',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Top Section (Header + Stats) */}
      <div style={{ flexShrink: 0 }}>
        {/* Staff Header Banner */}
        <div className="staff-header-banner" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: '#ccfbf1',
              color: '#0f766e',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '4px'
            }}>
              <Wrench size={14} /> Maintenance & Technical Staff Portal
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {filterTab === 'dashboard' ? 'Staff Work Operations Dashboard' :
               filterTab === 'pending' ? 'Pending Maintenance Requests' :
               filterTab === 'approval' ? 'Awaiting Admin Approval' :
               filterTab === 'in-progress' ? 'Work In Progress' :
               filterTab === 'resolved' ? 'Resolved Operations Archive' : 'All Operations Inventory'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Manage campus reported issues, request admin work approvals, and update resolution progress.
            </p>
          </div>
        </div>

        {/* 5 Stats Cards - Displayed ONLY on main Dashboard tab */}
        {filterTab === 'dashboard' && (
          <div className="staff-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {/* Total Issues */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
                TOTAL ISSUES
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {stats.total}
              </div>
            </div>

            {/* Pending */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c2410c' }}>
                ⏳ PENDING
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c2410c', marginTop: '2px' }}>
                {stats.pending}
              </div>
            </div>

            {/* Pending Admin Approval */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#faf5ff', borderColor: '#f3e8ff' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7e22ce' }}>
                🛡️ AWAITING ADMIN
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7e22ce', marginTop: '2px' }}>
                {stats.pendingApproval}
              </div>
            </div>

            {/* In Progress */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8' }}>
                🔧 WORK IN PROGRESS
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>
                {stats.inProgress}
              </div>
            </div>

            {/* Resolved */}
            <div className="card" style={{ padding: '16px', backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d' }}>
                ✓ RESOLVED
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                {stats.resolved}
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs & Minimal Dropdowns Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Filter Pills */}
          <div className="staff-filter-tabs" style={{ display: 'flex', gap: '6px' }}>
            {[
              { key: 'all', label: `All (${stats.total})` },
              { key: 'pending', label: `Pending (${stats.pending})` },
              { key: 'approval', label: `Awaiting Admin (${stats.pendingApproval})` },
              { key: 'in-progress', label: `In Progress (${stats.inProgress})` },
              { key: 'resolved', label: `Resolved (${stats.resolved})` }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: filterTab === tab.key ? '2px solid #0066ff' : '1px solid #cbd5e1',
                  backgroundColor: filterTab === tab.key ? '#eff6ff' : '#ffffff',
                  color: filterTab === tab.key ? '#0066ff' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Minimal Dropdowns Bar - NO Search */}
          <div className="staff-filter-dropdowns" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

            {/* Sort By Dropdown */}
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
      </div>

      {/* Scrollable Container ONLY for Issues Operations List */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="card staff-issue-card"
            style={{
              padding: '24px',
              borderRadius: '16px',
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1.2fr',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            {/* Column 1: Issue Details (Requirement 5.1) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 800, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                  {issue.ticketNumber}
                </span>
                <span className={`priority-pill priority-${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                  {issue.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {issue.title}
              </h3>

              <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '6px' }}>
                📍 <b>Location:</b> {issue.location.block}, {issue.location.floor}, {issue.location.room}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                👤 <b>Reported by:</b> {issue.reporter.name} ({issue.reporter.department || 'Student'})
              </div>
            </div>

            {/* Column 2: Progress & Approval Status (Requirement 5.3 & 5.4) */}
            <div style={{ padding: '0 12px', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  CURRENT STATUS
                </span>
                {issue.status === 'Pending' && <span className="badge badge-pending">⌛ Pending Work Request</span>}
                {issue.status === 'Pending Approval' && <span className="badge badge-approval">🛡️ Pending Admin Approval</span>}
                {issue.status === 'In Progress' && <span className="badge badge-in-progress">🔧 Work In Progress ({issue.progressPercent}%)</span>}
                {issue.status === 'Resolved' && <span className="badge badge-resolved">✓ Resolved (100%)</span>}
              </div>

              {/* Progress Slider Display */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                  <span>Completion</span>
                  <span>{issue.progressPercent}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                  <div style={{ width: `${issue.progressPercent}%`, height: '100%', backgroundColor: issue.status === 'Resolved' ? '#10b981' : '#0066ff' }} />
                </div>
              </div>
            </div>

            {/* Column 3: Work Authorization Action Controls (Requirement 5.2 & 5.4) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
              <button
                onClick={() => onSelectIssue(issue)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Eye size={16} /> View Full Details
              </button>

              {/* 5.4 Requirement: Send Request for Admin Approval */}
              {issue.status === 'Pending' && (
                <button
                  onClick={() => onRequestApproval(issue.id)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  🛡️ Request Admin Approval
                </button>
              )}

              {/* Awaiting Admin State */}
              {issue.status === 'Pending Approval' && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#7e22ce',
                  fontWeight: 700,
                  backgroundColor: '#faf5ff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e9d5ff',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  🔒 Waiting for Admin to grant permission
                </div>
              )}

              {/* Progress Updates (5.2 & 5.3) when approved */}
              {issue.status === 'In Progress' && (
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    onClick={() => onUpdateProgress(issue.id, Math.min(100, issue.progressPercent + 25), 'Work progress updated')}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.78rem' }}
                  >
                    + Add Progress
                  </button>
                  <button
                    onClick={() => onUpdateProgress(issue.id, 100, 'Issue fixed completely.')}
                    className="btn btn-success"
                    style={{ padding: '8px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    ✓ Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};
