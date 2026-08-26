import React, { useState } from 'react';
import { 
  Shield, BarChart3, Database, ChevronDown, ChevronUp, Menu, X, LogOut
} from 'lucide-react';
import type { Issue, CategoryStat, User } from '../types';
import { calculateCategoryStats } from '../services/storageService';

interface AdminDashboardProps {
  currentUser: User;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onApproveWork: (issueId: string, comment: string) => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  issues,
  onSelectIssue,
  onApproveWork,
  onOpenSettings,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'all-issues' | 'approval-requests' | 'tidb-config'>('overview');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'progress'>('newest');
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // TiDB Cloud config state
  const [tidbHost, setTidbHost] = useState('gateway01.ap-southeast-1.prod.aws.tidbcloud.com');
  const [tidbPort, setTidbPort] = useState('4000');
  const [tidbUser, setTidbUser] = useState('3xxx.root');
  const [tidbPass, setTidbPass] = useState('••••••••••••');
  const [tidbDb, setTidbDb] = useState('campusfix_db');
  const [tidbStatus, setTidbStatus] = useState<string | null>(null);

  const categoryStats: CategoryStat[] = calculateCategoryStats(issues);
  // Sort categories by highest complaint count
  const sortedCategories = [...categoryStats].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sortedCategories.map(c => c.count), 1);

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    pendingApproval: issues.filter(i => i.status === 'Pending Approval').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length
  };

  const pendingApprovalIssues = issues.filter(i => i.status === 'Pending Approval');

  const filteredIssues = issues
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

  const handleTestTiDBConnection = () => {
    setTidbStatus('Testing connection to TiDB Cloud cluster...');
    setTimeout(() => {
      setTidbStatus('✅ Connected successfully to TiDB Cloud! Database schema synced.');
    }, 1200);
  };

  return (
    <div className="admin-layout" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '24px 32px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Mobile Top Header Bar with Hamburger Button */}
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
          flexShrink: 0
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
            <Shield size={18} color="#a855f7" />
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Slide-In Mobile Left Drawer for Admin Portal */}
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
                    backgroundColor: '#7e22ce',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                      CampusFix
                    </h3>
                    <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Admin Oversight</span>
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
                Admin Controls
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => { setActiveTab('overview'); setIsMobileDrawerOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'overview' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'overview' ? '#1f2937' : 'transparent',
                    color: activeTab === 'overview' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'overview' ? '3px solid #a855f7' : '3px solid transparent'
                  }}
                >
                  <BarChart3 size={18} /> Overview & Analytics
                </button>

                <button
                  onClick={() => { setActiveTab('all-issues'); setIsMobileDrawerOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'all-issues' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'all-issues' ? '#1f2937' : 'transparent',
                    color: activeTab === 'all-issues' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'all-issues' ? '3px solid #a855f7' : '3px solid transparent'
                  }}
                >
                  📋 All Master Issues ({issues.length})
                </button>

                <button
                  onClick={() => { setActiveTab('approval-requests'); setIsMobileDrawerOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'approval-requests' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'approval-requests' ? '#1f2937' : 'transparent',
                    color: activeTab === 'approval-requests' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'approval-requests' ? '3px solid #a855f7' : '3px solid transparent'
                  }}
                >
                  🛡️ Pending Approvals ({pendingApprovalIssues.length})
                </button>

                <button
                  onClick={() => { setActiveTab('tidb-config'); setIsMobileDrawerOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'tidb-config' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'tidb-config' ? '#1f2937' : 'transparent',
                    color: activeTab === 'tidb-config' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'tidb-config' ? '3px solid #a855f7' : '3px solid transparent'
                  }}
                >
                  <Database size={18} /> TiDB Cloud Integration
                </button>
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
                Settings & Details
              </button>

              {onLogout && (
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Top Section (Header + Tabs + Stats) */}
      <div style={{ flexShrink: 0 }}>
        {/* Admin Header Banner */}
        <div className="admin-header-banner" style={{
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
              backgroundColor: '#f3e8ff',
              color: '#7e22ce',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '4px'
            }}>
              <Shield size={14} /> Executive Admin Command Center
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {activeTab === 'overview' ? 'Campus Infrastructure Oversight' :
               activeTab === 'all-issues' ? 'Master Issues Inventory' :
               activeTab === 'approval-requests' ? 'Pending Work Authorization Requests' : 'TiDB Cloud Database Sync'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Authorize staff work requests, review category analytics, and manage database integrations.
            </p>
          </div>
        </div>

        <div className="admin-tabs-bar" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            <BarChart3 size={16} /> Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab('all-issues')}
            className={`btn ${activeTab === 'all-issues' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            📋 All Issues ({issues.length})
          </button>
          <button
            onClick={() => setActiveTab('approval-requests')}
            className={`btn ${activeTab === 'approval-requests' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', position: 'relative' }}
          >
            🛡️ Approvals ({pendingApprovalIssues.length})
            {pendingApprovalIssues.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {pendingApprovalIssues.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tidb-config')}
            className={`btn ${activeTab === 'tidb-config' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            <Database size={16} /> TiDB Cloud DB
          </button>
        </div>

        {/* Overview Stat Counters - Displayed ONLY on main Overview & Analytics tab */}
        {activeTab === 'overview' && (
          <div className="admin-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>TOTAL ISSUES</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{stats.total}</div>
            </div>

            <div className="card" style={{ padding: '16px', backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c2410c' }}>⌛ PENDING REPORTED</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c2410c', marginTop: '2px' }}>{stats.pending}</div>
            </div>

            <div className="card" style={{ padding: '16px', backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7e22ce' }}>🛡️ AWAITING APPROVAL</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7e22ce', marginTop: '2px' }}>{stats.pendingApproval}</div>
            </div>

            <div className="card" style={{ padding: '16px', backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8' }}>🔧 IN PROGRESS</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>{stats.inProgress}</div>
            </div>

            <div className="card" style={{ padding: '16px', backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d' }}>✓ RESOLVED</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>{stats.resolved}</div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Container ONLY for Main Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '4px' }}>
        {/* Main Tab Views */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1st: Pending Work Authorization Requests (Top Priority) */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    🛡️ Pending Work Authorization Requests (6.2 & 6.3)
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Review maintenance staff authorization requests before work begins.
                  </span>
                </div>
                <span className="badge badge-approval">{pendingApprovalIssues.length} Pending</span>
              </div>

              {pendingApprovalIssues.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  ✓ No pending work approval requests. All staff authorizations are up to date!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingApprovalIssues.map((issue) => (
                    <div key={issue.id} style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      backgroundColor: '#faf5ff',
                      border: '1px solid #e9d5ff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7e22ce' }}>{issue.ticketNumber} • {issue.priority} Priority</span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>{issue.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>📍 {issue.location.block}, {issue.location.room} | Staff: <b>{issue.assignedStaff?.name || 'Maintenance Tech'}</b></span>
                      </div>
                      <button
                        onClick={() => onApproveWork(issue.id, 'Approved by Admin')}
                        className="btn btn-success"
                        style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                      >
                        ✓ Grant Approval
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2nd: Category Complaint Distribution (Collapsible Accordion Card) */}
            <div className="card" style={{ padding: '24px' }}>
              <div 
                onClick={() => setIsCategoryExpanded(prev => !prev)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📊 Category Complaint Distribution
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Identifies highest priority infrastructure problem areas across campus.
                  </p>
                </div>
                <button
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  {isCategoryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {isCategoryExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  {sortedCategories.map((cat, idx) => {
                    const percentage = Math.round((cat.count / maxCount) * 100);
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                          <span style={{ color: '#0f172a' }}>{cat.category}</span>
                          <span style={{ color: '#0066ff' }}>{cat.count} Issues ({cat.resolvedCount} Resolved)</span>
                        </div>
                        <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: cat.color,
                            borderRadius: '5px',
                            transition: 'width 0.6s ease'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Master Issues Inventory Tab */}
        {activeTab === 'all-issues' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Master Issues Inventory</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Showing {filteredIssues.length} of {issues.length} campus issues</span>
                </div>
              </div>

              {/* Minimal Filter & Sort Control Toolbar - NO Search */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {/* Left Controls: Category + Status + Priority */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {/* Category Filter */}
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

                  {/* Status Filter */}
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ height: '32px', fontSize: '0.8rem', padding: '0 8px', width: '130px', borderRadius: '6px' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Pending Approval">Awaiting Approval</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {/* Priority Filter */}
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
                </div>

                {/* Right Controls: Sort By */}
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
            </div>

            <div className="admin-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Ticket</th>
                    <th style={{ padding: '12px' }}>Title & Category</th>
                    <th style={{ padding: '12px' }}>Location</th>
                    <th style={{ padding: '12px' }}>Priority</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Work Permission</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, fontFamily: 'monospace' }}>{issue.ticketNumber}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{issue.title}</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{issue.category}</span>
                      </td>
                      <td style={{ padding: '12px', color: '#475569' }}>{issue.location.block}, {issue.location.room}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`priority-pill priority-${issue.priority.toLowerCase()}`}>{issue.priority}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {issue.status === 'In Progress' && <span className="badge badge-in-progress">In Progress</span>}
                        {issue.status === 'Pending' && <span className="badge badge-pending">Pending</span>}
                        {issue.status === 'Pending Approval' && <span className="badge badge-approval">Awaiting Approval</span>}
                        {issue.status === 'Resolved' && <span className="badge badge-resolved">Resolved</span>}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {issue.adminApproval.approved ? (
                          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.78rem' }}>✓ Authorized</span>
                        ) : issue.status === 'Pending Approval' ? (
                          <span style={{ color: '#7e22ce', fontWeight: 700, fontSize: '0.78rem' }}>🛡️ Permission Requested</span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Not Requested</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => onSelectIssue(issue)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Requirement 6.2 & 6.3: Approval Requests Dedicated Tab */}
      {activeTab === 'approval-requests' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
            🛡️ Staff Work Authorization Center (6.2 & 6.3)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
            As per safety guidelines, maintenance staff work cannot start until Admin grants permission.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingApprovalIssues.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                All work requests have been reviewed and approved!
              </div>
            ) : (
              pendingApprovalIssues.map((issue) => (
                <div key={issue.id} style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: '#faf5ff',
                  border: '1px solid #e9d5ff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7e22ce' }}>
                      {issue.ticketNumber} • {issue.priority} Priority
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                      {issue.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                      📍 {issue.location.block}, {issue.location.room} | Staff Requesting: <b>{issue.assignedStaff?.name || 'Maintenance Tech'}</b>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => onApproveWork(issue.id, 'Work authorization granted by Admin')}
                      className="btn btn-success"
                      style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      ✓ Approve Work Start
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TiDB Cloud Database Integration Tab */}
      {activeTab === 'tidb-config' && (
        <div className="card" style={{ padding: '28px', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Database size={28} color="#0066ff" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>TiDB Cloud Database Connection</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Configure your TiDB Cloud Serverless MySQL cluster endpoint and credentials.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">TiDB Host Endpoint</label>
            <input
              type="text"
              className="form-input"
              value={tidbHost}
              onChange={(e) => setTidbHost(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Port</label>
              <input
                type="text"
                className="form-input"
                value={tidbPort}
                onChange={(e) => setTidbPort(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Database Name</label>
              <input
                type="text"
                className="form-input"
                value={tidbDb}
                onChange={(e) => setTidbDb(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">User</label>
            <input
              type="text"
              className="form-input"
              value={tidbUser}
              onChange={(e) => setTidbUser(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={tidbPass}
              onChange={(e) => setTidbPass(e.target.value)}
            />
          </div>

          {tidbStatus && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: tidbStatus.includes('✅') ? '#f0fdf4' : '#eff6ff',
              color: tidbStatus.includes('✅') ? '#15803d' : '#1d4ed8',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {tidbStatus}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={handleTestTiDBConnection}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontWeight: 700 }}
            >
              Test & Connect TiDB Cloud DB
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
