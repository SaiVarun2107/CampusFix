import React from 'react';
import { Wrench, BarChart3, LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenImpactModal: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenImpactModal,
  onNavigate,
  currentPage,
  onLogout
}) => {
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Wrench size={20} />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            letterSpacing: '-0.03em'
          }}>
            CampusFix
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <button 
            onClick={() => onNavigate('landing')} 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: currentPage === 'landing' ? 700 : 500,
              color: currentPage === 'landing' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            How it Works
          </button>
          
          <button 
            onClick={onOpenImpactModal} 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#2563eb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BarChart3 size={16} />
            Impact
          </button>

          {currentUser && (
            <button 
              onClick={() => onNavigate(currentUser.role === 'student' ? 'student-dashboard' : currentUser.role === 'staff' ? 'staff-dashboard' : 'admin-dashboard')} 
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: currentPage.includes('dashboard') ? 700 : 500,
                color: currentPage.includes('dashboard') ? 'var(--color-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer'
              }}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Right Section: Log In & Sign Up / User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#0066ff',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserIcon size={14} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => onNavigate('login')}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.875rem', fontWeight: 600 }}
              >
                Log In
              </button>
              <button 
                onClick={() => onNavigate('signup')}
                className="btn btn-dark"
                style={{ padding: '8px 18px', fontSize: '0.875rem', fontWeight: 700 }}
              >
                Sign Up →
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
