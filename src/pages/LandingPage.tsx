import React from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onOpenImpactModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onOpenImpactModal
}) => {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '60px 24px 80px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left Text Column */}
        <div>
          {/* Announcement Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            <span style={{
              backgroundColor: '#0066ff',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              textTransform: 'uppercase'
            }}>
              NEW
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
              Real-time issue tracking now live
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            marginBottom: '20px'
          }}>
            Report campus issues.{' '}
            <span style={{ color: '#0066ff' }}>Track progress.</span>{' '}
            Improve your campus.
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '520px'
          }}>
            A streamlined, transparent platform for students and faculty to report infrastructure problems and for maintenance teams to resolve them efficiently.
          </p>

          {/* Hero Buttons */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={onNavigateToLogin}
              className="btn btn-dark"
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              🚀 Get Started
            </button>

            <button
              onClick={onOpenImpactModal}
              className="btn btn-secondary"
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              <BarChart3 size={18} color="#0066ff" />
              View Impact
            </button>
          </div>
        </div>

        {/* Right Photo Column matching Screenshot 1 */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid #e2e8f0'
          }}>
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000"
              alt="Campus Students"
              style={{ width: '100%', height: '440px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Floating Ticket Notification Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                Ticket #4928
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '1px 0' }}>
                HVAC Repaired
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Just now in Science Bldg
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '48px' }}>
            How it Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                fontSize: '1.5rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Report
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '280px', lineHeight: 1.5 }}>
                Log in to your account, snap a photo, and pin the location.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                fontSize: '1.5rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Track
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '280px', lineHeight: 1.5 }}>
                Get live updates as your issue moves to resolution.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                fontSize: '1.5rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Resolve
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '280px', lineHeight: 1.5 }}>
                Maintenance teams fix it quickly and close the ticket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
        color: '#64748b'
      }}>
        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
          CampusFix
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>
        <div>
          © 2026 CampusFix Infrastructure Management
        </div>
      </footer>
    </div>
  );
};
