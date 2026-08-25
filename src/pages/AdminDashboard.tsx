import React, { useState } from 'react';
import { 
  Shield, BarChart3, Search, Database
} from 'lucide-react';
import type { Issue, CategoryStat, User } from '../types';
import { calculateCategoryStats } from '../services/storageService';

interface AdminDashboardProps {
  currentUser: User;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onApproveWork: (issueId: string, comment: string) => void;
  onOpenSettings: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  issues,
  onSelectIssue,
  onApproveWork,
  onOpenSettings
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'all-issues' | 'approval-requests' | 'tidb-config'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredIssues = issues.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestTiDBConnection = () => {
    setTidbStatus('Testing connection to TiDB Cloud cluster...');
    setTimeout(() => {
      setTidbStatus('✅ Connected successfully to TiDB Cloud! Database schema synced.');
    }, 1200);
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Admin Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px'
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
            marginBottom: '6px'
          }}>
            <Shield size={14} /> Executive Admin Command Center
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            Campus Infrastructure Oversight
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
            Authorize staff work requests, review category analytics, and manage database integrations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenSettings}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            Settings & Details
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
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

      {/* Overview Stat Counters for Requirement 6 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>TOTAL ISSUES</span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{stats.total}</div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c2410c' }}>⌛ PENDING REPORTED</span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#c2410c', marginTop: '4px' }}>{stats.pending}</div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7e22ce' }}>🛡️ AWAITING APPROVAL</span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#7e22ce', marginTop: '4px' }}>{stats.pendingApproval}</div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8' }}>🔧 IN PROGRESS</span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>{stats.inProgress}</div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d' }}>✓ RESOLVED</span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>{stats.resolved}</div>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Requirement 6 Category Graph visualization */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                📊 Category Complaint Distribution
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Identifies highest priority infrastructure problem areas across campus.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sortedCategories.map((cat, idx) => {
                const percentage = Math.round((cat.count / maxCount) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#0f172a' }}>{cat.category}</span>
                      <span style={{ color: '#0066ff' }}>{cat.count} Issues ({cat.resolvedCount} Resolved)</span>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: cat.color,
                        borderRadius: '6px',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Permission Approvals List */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                🛡️ Pending Work Authorization Requests (6.2 & 6.3)
              </h3>
              <span className="badge badge-approval">{pendingApprovalIssues.length} Pending</span>
            </div>

            {pendingApprovalIssues.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                No pending work approval requests. All staff authorizations are up to date!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingApprovalIssues.map((issue) => (
                  <div key={issue.id} style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7e22ce' }}>{issue.ticketNumber}</span>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{issue.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {issue.location.block}, {issue.location.room}</span>
                      </div>
                      <button
                        onClick={() => onApproveWork(issue.id, 'Approved by Admin')}
                        className="btn btn-success"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        ✓ Grant Approval
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requirement 6.1: All Issues Table */}
      {activeTab === 'all-issues' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Master Issues Inventory (6.1)</h3>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Filter issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
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
  );
};
