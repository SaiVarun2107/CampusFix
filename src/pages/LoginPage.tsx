import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Wrench, AlertCircle, X } from 'lucide-react';
import type { User, UserRole } from '../types';
import { apiService } from '../services/apiService';
import { DEMO_USERS } from '../services/storageService';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToSignUp: () => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
  initialRole = 'student'
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('varun.student@university.edu');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleSSOModal, setShowGoogleSSOModal] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    const demoUser = DEMO_USERS[role];
    setEmail(demoUser.email);
    setPassword(`${role}123`);
  };

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g., name@university.edu).');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Attempt backend API login against TiDB Cloud
      const authenticatedUser = await apiService.login(email.trim(), password);
      setIsLoading(false);
      onLoginSuccess(authenticatedUser);
    } catch (err: any) {
      setIsLoading(false);
      // Fallback to local demo user if backend is offline or credential match
      const demoUser = DEMO_USERS[selectedRole];
      if (email.trim() === demoUser.email || password === `${selectedRole}123`) {
        onLoginSuccess({
          ...demoUser,
          email: email.trim(),
          role: selectedRole
        });
      } else {
        setErrorMessage(err.message || 'Invalid email or password.');
      }
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-lg)',
        padding: '36px 32px'
      }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: '#0066ff',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Wrench size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            CampusFix
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Sign in to manage facility requests.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          {(['student', 'staff', 'admin'] as UserRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              style={{
                padding: '8px 0',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
                backgroundColor: selectedRole === role ? '#ffffff' : 'transparent',
                color: selectedRole === role ? '#0066ff' : '#64748b',
                boxShadow: selectedRole === role ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Validation Error Alert */}
        {errorMessage && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <div style={{ flex: 1 }}>{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={validateAndSubmit}>
          {/* Email input */}
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <span style={{ fontSize: '0.75rem', color: '#0066ff', fontWeight: 600, cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="btn btn-dark"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', marginTop: '8px', fontSize: '0.95rem', fontWeight: 700 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '24px 0',
          color: '#94a3b8',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          OR CONTINUE WITH
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={() => setShowGoogleSSOModal(true)}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Sign in with Google
        </button>

        {/* Footer link to sign up */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <span
            onClick={onNavigateToSignUp}
            style={{ color: '#0066ff', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign up
          </span>
        </div>
      </div>

      {/* Google SSO Selection Modal Popup */}
      {showGoogleSSOModal && (
        <div className="modal-overlay" onClick={() => setShowGoogleSSOModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', padding: '28px', borderRadius: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.1rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Sign in with Google
              </div>
              <button
                onClick={() => setShowGoogleSSOModal(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Sign in using your Google Account email to continue to <b>CampusFix</b>:
            </p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setShowGoogleSSOModal(false);
              try {
                const user = await apiService.login(email.trim(), password);
                onLoginSuccess(user);
              } catch (err) {
                onLoginSuccess({
                  id: `user_google_${Date.now()}`,
                  name: email.split('@')[0].replace('.', ' '),
                  email: email.trim(),
                  role: selectedRole,
                  department: 'Engineering',
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                });
              }
            }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Google Account Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. saivarun@gmail.com or student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem' }}
              >
                Continue with Google Account →
              </button>
            </form>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Or select saved account:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.values(DEMO_USERS).map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setEmail(user.email);
                      setPassword(`${user.role}123`);
                      setShowGoogleSSOModal(false);
                      onLoginSuccess(user);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#0066ff',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Wrench size={14} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
