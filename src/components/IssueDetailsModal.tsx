import React, { useState } from 'react';
import { X, Clock, MapPin, ShieldAlert, Shield } from 'lucide-react';
import type { Issue, UserRole } from '../types';

interface IssueDetailsModalProps {
  issue: Issue | null;
  onClose: () => void;
  currentUserRole: UserRole;
  onRequestApproval?: (issueId: string) => void;
  onApproveWork?: (issueId: string, comment: string) => void;
  onUpdateProgress?: (issueId: string, progress: number, notes: string) => void;
}

export const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({
  issue,
  onClose,
  currentUserRole,
  onRequestApproval,
  onApproveWork,
  onUpdateProgress
}) => {
  const [adminComment, setAdminComment] = useState('');
  const [progressInput, setProgressInput] = useState(issue ? issue.progressPercent : 0);
  const [progressNotes, setProgressNotes] = useState('');

  if (!issue) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-pending">⌛ Pending</span>;
      case 'Pending Approval':
        return <span className="badge badge-approval">🛡️ Pending Admin Approval</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress">🔧 In Progress</span>;
      case 'Resolved':
        return <span className="badge badge-resolved">✓ Resolved</span>;
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: '0', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              fontWeight: 800,
              padding: '4px 10px',
              backgroundColor: '#e2e8f0',
              borderRadius: '6px'
            }}>
              {issue.ticketNumber}
            </span>
            {getStatusBadge(issue.status)}
            <span className={`priority-pill priority-${issue.priority.toLowerCase()}`}>
              {issue.priority} Priority
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#e2e8f0',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title & Category */}
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              {issue.category}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 8px 0' }}>
              {issue.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#475569' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} color="var(--color-primary)" />
                {issue.location.block} • {issue.location.floor} • {issue.location.room}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={16} color="#94a3b8" />
                Reported {issue.createdAt.includes('T') ? 'Recently' : issue.createdAt}
              </span>
            </div>
          </div>

          {/* Issue Photo Attachment */}
          {issue.attachmentUrl && (
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                📷 Attached Evidence Photo:
              </span>
              <img
                src={issue.attachmentUrl}
                alt={issue.title}
                style={{
                  width: '100%',
                  maxHeight: '260px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '1px solid var(--color-border)'
                }}
              />
            </div>
          )}

          {/* Description */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Description:
            </span>
            <p style={{ fontSize: '0.9rem', color: '#334155', whiteSpace: 'pre-line' }}>
              {issue.description}
            </p>
          </div>

          {/* Progress Bar Display */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Resolution Progress</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {issue.progressPercent}%
              </span>
            </div>
            <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                width: `${issue.progressPercent}%`,
                height: '100%',
                backgroundColor: issue.status === 'Resolved' ? '#10b981' : 'var(--color-primary)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Workflow Action Section (Role Dependent) */}

          {/* 1. Staff Action: Request Admin Approval */}
          {currentUserRole === 'staff' && issue.status === 'Pending' && onRequestApproval && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={18} /> Admin Approval Required
                </span>
                <p style={{ fontSize: '0.78rem', color: '#9a3412', marginTop: '2px' }}>
                  Per safety rules, work cannot begin until campus admin grants authorization.
                </p>
              </div>
              <button
                onClick={() => onRequestApproval(issue.id)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              >
                Request Admin Approval
              </button>
            </div>
          )}

          {/* 2. Admin Action: Grant Approval */}
          {currentUserRole === 'admin' && issue.status === 'Pending Approval' && onApproveWork && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7e22ce', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={18} /> Staff Requesting Work Approval
              </span>
              <p style={{ fontSize: '0.8rem', color: '#6b21a8' }}>
                Staff member <b>{issue.assignedStaff?.name || 'Maintenance Team'}</b> has requested permission to start work.
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="Optional admin instructions or note..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => onApproveWork(issue.id, adminComment || 'Approved by Admin')}
                  className="btn btn-success"
                  style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                >
                  ✓ Approve & Authorize Work
                </button>
              </div>
            </div>
          )}

          {/* 3. Staff Action: Update Progress (Only available when approved / in progress) */}
          {currentUserRole === 'staff' && (issue.status === 'In Progress' || (issue.status === 'Pending Approval' && issue.adminApproval.approved)) && onUpdateProgress && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d4ed8' }}>
                🔧 Update Work Progress & Status
              </span>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Set Completion Percentage ({progressInput}%):</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={progressInput}
                  onChange={(e) => setProgressInput(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="Add progress note (e.g. Parts replaced, testing complete)..."
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
              <button
                onClick={() => onUpdateProgress(issue.id, progressInput, progressNotes || 'Progress updated')}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-end', padding: '8px 18px', fontSize: '0.82rem' }}
              >
                Save Progress
              </button>
            </div>
          )}

          {/* Activity Timeline Log */}
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '12px' }}>
              📜 History & Activity Log
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {issue.activityLog.map((log) => (
                <div key={log.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  fontSize: '0.82rem',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  borderLeft: '3px solid var(--color-primary)'
                }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{log.text}</span>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
