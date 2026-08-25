import React from 'react';
import { X, CheckCircle2, Users, Smile, Sparkles } from 'lucide-react';
import type { Issue } from '../types';

interface ImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: Issue[];
  onNavigateToLogin: () => void;
  isLoggedIn: boolean;
}

export const ImpactModal: React.FC<ImpactModalProps> = ({
  isOpen,
  onClose,
  issues,
  onNavigateToLogin,
  isLoggedIn
}) => {
  if (!isOpen) return null;

  const resolvedIssues = issues.filter(i => i.status === 'Resolved');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 20%)',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '28px 32px 16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '8px'
            }}>
              <Sparkles size={14} /> Live Impact Metrics
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a',
              fontFamily: 'var(--font-heading)'
            }}>
              Our Collective Impact
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
              Together, we're building a better campus. Every report matters, every fix improves our community.
            </p>
          </div>
          <button
            onClick={onClose}
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
            <X size={20} />
          </button>
        </div>

        {/* Main Grid Content */}
        <div style={{ padding: '0 32px 32px 32px' }}>
          {/* Top 3 KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0066ff', fontSize: '0.8rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} /> TOTAL RESOLVED
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '8px 0 2px 0' }}>
                2,458
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                ↗ +12% this month
              </span>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.8rem', fontWeight: 700 }}>
                <Users size={18} /> ACTIVE MEMBERS
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '8px 0 2px 0' }}>
                8,902
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                🕒 Last active 5 mins ago
              </span>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontSize: '0.8rem', fontWeight: 700 }}>
                <Smile size={18} /> USER SATISFACTION
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '8px 0 2px 0' }}>
                98%
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                ↗ Up by 5%
              </span>
            </div>
          </div>

          {/* 2-Column Split: Category Improvements & Recent Wins */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Left Column: Category Progress & Resolution Trends */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Category Breakdown */}
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                  Campus Improvements by Category
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      <span>💧 Plumbing & Water</span>
                      <span>850</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      <span>⚡ Electrical & Lighting</span>
                      <span>620</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '68%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      <span>🪑 Furniture & Fixtures</span>
                      <span>410</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45%', height: '100%', backgroundColor: '#94a3b8', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      <span>🧹 Custodial Services</span>
                      <span>210</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#cbd5e1', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Trends Bar Visualization */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Resolution Trends</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Issues resolved over the last 6 months</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', padding: '0 10px' }}>
                  {[
                    { month: 'Jul', val: 50 },
                    { month: 'Aug', val: 68 },
                    { month: 'Sep', val: 52 },
                    { month: 'Oct', val: 80 },
                    { month: 'Nov', val: 92 },
                    { month: 'Dec', val: 100 }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '36px' }}>
                      <div style={{
                        width: '100%',
                        height: `${item.val}%`,
                        backgroundColor: idx === 5 ? '#0066ff' : '#93c5fd',
                        borderRadius: '6px 6px 0 0'
                      }} />
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Recent Wins Feed */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Wins</h4>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Issues resolved this week</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {resolvedIssues.slice(0, 4).map((issue) => (
                  <div key={issue.id} style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-resolved" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        <CheckCircle2 size={12} /> Resolved
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {issue.updatedAt.includes('T') ? 'Recently' : issue.updatedAt}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      {issue.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      📍 {issue.location.block}, {issue.location.room}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Call to Action Banner */}
          <div style={{
            marginTop: '24px',
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
              Ready to make a difference?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Join thousands of students and staff who are already helping to improve our campus environment every day.
            </p>
            <button
              onClick={() => { onClose(); onNavigateToLogin(); }}
              className="btn btn-dark"
              style={{ padding: '10px 28px', borderRadius: '10px', fontWeight: 700 }}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Log In to Report & Track'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
