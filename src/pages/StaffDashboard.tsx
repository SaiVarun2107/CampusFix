import React, { useState } from 'react';
import { 
  Wrench, Search, Eye
} from 'lucide-react';
import type { Issue, User } from '../types';

interface StaffDashboardProps {
  currentUser: User;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onRequestApproval: (issueId: string) => void;
  onUpdateProgress: (issueId: string, progress: number, notes: string) => void;
  onOpenSettings: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  issues,
  onSelectIssue,
  onRequestApproval,
  onUpdateProgress,
  onOpenSettings
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approval' | 'in-progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    pendingApproval: issues.filter(i => i.status === 'Pending Approval').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length
  };

  const filteredIssues = issues.filter(issue => {
    if (filterTab === 'pending') return issue.status === 'Pending';
    if (filterTab === 'approval') return issue.status === 'Pending Approval';
    if (filterTab === 'in-progress') return issue.status === 'In Progress';
    if (filterTab === 'resolved') return issue.status === 'Resolved';
    return true;
  }).filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.reporter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Staff Header Banner */}
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
            backgroundColor: '#ccfbf1',
            color: '#0f766e',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            <Wrench size={14} /> Maintenance & Technical Staff Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            Staff Work Operations Dashboard
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
            Manage campus reported issues, request admin work approvals, and update resolution progress.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
            Logged in as: <b>{currentUser.name}</b> ({currentUser.designation || 'Staff'})
          </span>
          <button
            onClick={onOpenSettings}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Settings & Details
          </button>
        </div>
      </div>

      {/* 5 Stats Cards for Requirement 5 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Total Issues */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
            TOTAL ISSUES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {stats.total}
          </div>
        </div>

        {/* Pending */}
        <div className="card" style={{ padding: '20px', backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c2410c' }}>
            ⏳ PENDING
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#c2410c', marginTop: '4px' }}>
            {stats.pending}
          </div>
        </div>

        {/* Pending Admin Approval (5.4 Requirement) */}
        <div className="card" style={{ padding: '20px', backgroundColor: '#faf5ff', borderColor: '#f3e8ff' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7e22ce' }}>
            🛡️ AWAITING ADMIN
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#7e22ce', marginTop: '4px' }}>
            {stats.pendingApproval}
          </div>
        </div>

        {/* In Progress */}
        <div className="card" style={{ padding: '20px', backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8' }}>
            🔧 WORK IN PROGRESS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
            {stats.inProgress}
          </div>
        </div>

        {/* Resolved */}
        <div className="card" style={{ padding: '20px', backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d' }}>
            ✓ RESOLVED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
            {stats.resolved}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all', label: `All Issues (${stats.total})` },
            { key: 'pending', label: `Pending (${stats.pending})` },
            { key: 'approval', label: `Awaiting Admin (${stats.pendingApproval})` },
            { key: 'in-progress', label: `In Progress (${stats.inProgress})` },
            { key: 'resolved', label: `Resolved (${stats.resolved})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.82rem',
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

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by title, building, reporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', fontSize: '0.82rem' }}
          />
        </div>
      </div>

      {/* Issues Operations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="card"
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
  );
};
