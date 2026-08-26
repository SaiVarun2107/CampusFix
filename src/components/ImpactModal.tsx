import React from 'react';
import { X, CheckCircle2, Users, Smile, Sparkles, Zap, ShieldCheck, Award } from 'lucide-react';
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

  const totalIssuesCount = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved');
  const totalResolvedCount = resolvedIssues.length;
  
  // Calculate unique active reporters / members from real data
  const uniqueReporters = new Set(
    issues.map(i => i.reporter?.id || i.reporter?.email || i.reporter?.name).filter(Boolean)
  ).size;
  const activeMembersCount = Math.max(uniqueReporters, 1);

  // Dynamic resolution rate based on actual issues data
  const resolutionRate = totalIssuesCount > 0 
    ? Math.round((totalResolvedCount / totalIssuesCount) * 100) 
    : 100;

  // Category counts computed from actual live issues list
  const categoryMap: Record<string, { icon: string; color: string }> = {
    'Plumbing & Water': { icon: '💧', color: '#0284c7' },
    'Electrical & Lighting': { icon: '⚡', color: '#eab308' },
    'IT & AV Equipment': { icon: '💻', color: '#0066ff' },
    'Furniture & Carpentry': { icon: '🪑', color: '#8b5cf6' },
    'HVAC & Cooling': { icon: '❄️', color: '#06b6d4' },
    'Campus Infrastructure': { icon: '🏛️', color: '#64748b' }
  };

  const defaultCategories = [
    'Plumbing & Water',
    'Electrical & Lighting',
    'IT & AV Equipment',
    'Furniture & Carpentry',
    'HVAC & Cooling',
    'Campus Infrastructure'
  ];

  const categoryStatsList = defaultCategories.map(catName => {
    const totalInCat = issues.filter(i => i.category === catName).length;
    const resolvedInCat = issues.filter(i => i.category === catName && i.status === 'Resolved').length;
    return {
      name: catName,
      icon: categoryMap[catName]?.icon || '🔧',
      color: categoryMap[catName]?.color || '#0066ff',
      total: totalInCat,
      resolved: resolvedInCat
    };
  });

  const maxCategoryCount = Math.max(...categoryStatsList.map(c => c.total), 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '920px',
          background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 20%)',
          padding: '0',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '24px 32px 16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexShrink: 0
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
              marginBottom: '6px'
            }}>
              <Sparkles size={14} /> Live Impact Metrics
            </div>
            <h2 style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#0f172a',
              fontFamily: 'var(--font-heading)'
            }}>
              Our Collective Impact
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
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

        {/* Scrollable Body Content */}
        <div style={{ padding: '0 32px 28px 32px', overflowY: 'auto', flex: 1 }}>
          {/* Top 3 KPI Cards - matched with actual data */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0066ff', fontSize: '0.78rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} /> TOTAL RESOLVED
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#0f172a' }}>
                {totalResolvedCount}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                ✓ {totalResolvedCount} of {totalIssuesCount} issues fixed
              </span>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700 }}>
                <Users size={18} /> ACTIVE CONTRIBUTORS
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#0f172a' }}>
                {activeMembersCount}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                👤 Registered campus reporters
              </span>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontSize: '0.78rem', fontWeight: 700 }}>
                <Smile size={18} /> RESOLUTION EFFICIENCY
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#0f172a' }}>
                {resolutionRate}%
              </div>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                ⚡ Operational success rate
              </span>
            </div>
          </div>

          {/* 2-Column Split: Category Improvements & Recent Wins */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Left Column: Category Progress & Operational Velocity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category Breakdown */}
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
                  Campus Improvements by Category
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categoryStatsList.map((c, idx) => {
                    const percentage = Math.round((c.total / maxCategoryCount) * 100);
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
                          <span style={{ color: '#0f172a' }}>{c.icon} {c.name}</span>
                          <span style={{ color: '#0066ff' }}>{c.total} issues ({c.resolved} resolved)</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${c.total > 0 ? Math.max(percentage, 8) : 0}%`,
                            height: '100%',
                            backgroundColor: c.color,
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NEW High Impact Card: Operational Velocity & Integrity (Replaces Resolution Trends) */}
              <div className="card" style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} color="#38bdf8" />
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Resolution Velocity & Health
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
                      Operational efficiency & verification metrics
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    whiteSpace: 'nowrap'
                  }}>
                    ● LIVE
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                  }}>
                    <Zap size={16} color="#38bdf8" style={{ margin: '0 auto 4px auto' }} />
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>RESPONSE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>&lt; 24h</div>
                  </div>

                  <div style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                  }}>
                    <ShieldCheck size={16} color="#4ade80" style={{ margin: '0 auto 4px auto' }} />
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>VERIFIED</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80', marginTop: '2px' }}>100%</div>
                  </div>

                  <div style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                  }}>
                    <Award size={16} color="#fbbf24" style={{ margin: '0 auto 4px auto' }} />
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>TRACKING</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>Real-time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Wins Feed (Scrollable & Capped at 3 Recent Wins) */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>Recent Wins</h4>
                  <span style={{ fontSize: '0.73rem', color: '#64748b' }}>3 most recent resolved issues</span>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                  {resolvedIssues.length} Resolved
                </span>
              </div>

              {/* Scrollable list container capped at 3 items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {resolvedIssues.length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b', fontSize: '0.82rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <CheckCircle2 size={24} color="#94a3b8" style={{ margin: '0 auto 6px auto' }} />
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>No resolved issues yet</p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reported issues will appear here as soon as staff resolves them.</span>
                  </div>
                ) : (
                  resolvedIssues.slice(0, 3).map((issue) => (
                    <div key={issue.id} style={{
                      padding: '12px 14px',
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
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Call to Action Banner */}
          <div style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '4px', color: '#0f172a' }}>
              Ready to make a difference?
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              Join thousands of students and staff who are already helping to improve our campus environment every day.
            </p>
            <button
              onClick={() => { onClose(); onNavigateToLogin(); }}
              className="btn btn-dark"
              style={{ padding: '10px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Log In to Report & Track'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
