import React, { useState } from 'react';
import { Wrench, User as UserIcon, Mail, GraduationCap, AlertCircle, IdCard, Briefcase } from 'lucide-react';
import type { User, UserRole } from '../types';
import { apiService } from '../services/apiService';

interface SignUpPageProps {
  onSignUpSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSignUpSuccess,
  onNavigateToLogin
}) => {
  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // Student Specific Fields
  const [vtuNo, setVtuNo] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');

  // Staff Specific Fields
  const [ttsNo, setTtsNo] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid university email address (e.g., student@university.edu).');
      return;
    }

    // Role-specific ID validations
    if (role === 'student') {
      if (!vtuNo.trim() || vtuNo.trim().length < 2) {
        setErrorMessage('VTU No. (College Student ID) is mandatory for student registration.');
        return;
      }
    } else {
      if (!ttsNo.trim() || ttsNo.trim().length < 3) {
        setErrorMessage('Please enter a valid college TTS Number (e.g., TTS9042).');
        return;
      }
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match! Please check password confirmation.');
      return;
    }

    setIsLoading(true);
    try {
      // Call live backend API signup endpoint connected to TiDB Cloud
      const newUser = await apiService.signup({
        name: fullName.trim(),
        email: email.trim(),
        password,
        role,
        department: role === 'student' ? department : undefined,
        year: role === 'student' ? year : undefined,
        vtuNo: role === 'student' ? vtuNo.trim() : undefined,
        ttsNo: role === 'staff' ? ttsNo.trim() : undefined,
        designation: role === 'staff' ? designation : undefined
      });

      setIsLoading(false);
      onSignUpSuccess(newUser);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Failed to create account.');
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
        maxWidth: '480px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-lg)',
        padding: '36px 32px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#0066ff',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <Wrench size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            CampusFix
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            Create a {role === 'student' ? 'Student' : 'Staff'} Account
          </p>
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

        <form onSubmit={handleSignUp}>
          {/* I am a... Role Selector */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748b' }}>I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: role === 'student' ? '2px solid #0066ff' : '1px solid #e2e8f0',
                  backgroundColor: role === 'student' ? '#eff6ff' : '#ffffff',
                  color: role === 'student' ? '#0066ff' : '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <GraduationCap size={18} /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('staff')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: role === 'staff' ? '2px solid #0066ff' : '1px solid #e2e8f0',
                  backgroundColor: role === 'staff' ? '#eff6ff' : '#ffffff',
                  color: role === 'staff' ? '#0066ff' : '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Wrench size={18} /> Staff
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* College Email */}
          <div className="form-group">
            <label className="form-label">College Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="jane.doe@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <>
              {/* VTU No. (ID given by college for student) */}
              <div className="form-group">
                <label className="form-label">VTU No. (College Student ID) *</label>
                <div style={{ position: 'relative' }}>
                  <IdCard size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="e.g. VTU30363 or vtu1024"
                    value={vtuNo}
                    onChange={(e) => setVtuNo(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Department & Year Dropdowns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Mechanical Eng">Mechanical Eng</option>
                    <option value="Electrical Eng">Electrical Eng</option>
                    <option value="Civil Eng">Civil Eng</option>
                    <option value="Information Science">Information Science</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Staff Specific Fields */}
          {role === 'staff' && (
            <>
              {/* TTS Number */}
              <div className="form-group">
                <label className="form-label">TTS Number (College Staff ID) *</label>
                <div style={{ position: 'relative' }}>
                  <IdCard size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="e.g. TTS9042 or tts1024"
                    value={ttsNo}
                    onChange={(e) => setTtsNo(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Designation Dropdown */}
              <div className="form-group">
                <label className="form-label">Designation *</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <select
                    className="form-select"
                    style={{ paddingLeft: '40px' }}
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor / Senior Professor">Professor / Senior Professor</option>
                    <option value="Lab Assistant / Technical Staff">Lab Assistant / Technical Staff</option>
                    <option value="Facility Maintenance Staff">Facility Maintenance Staff</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Password fields */}
          <div className="form-group">
            <label className="form-label">Password * (min. 6 characters)</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', marginTop: '12px', fontWeight: 700 }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
          Already have an account?{' '}
          <span
            onClick={onNavigateToLogin}
            style={{ color: '#0066ff', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Log in here
          </span>
        </div>
      </div>
    </div>
  );
};
