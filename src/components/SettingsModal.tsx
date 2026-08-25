import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, IdCard, ShieldCheck, Edit3, Check, Save } from 'lucide-react';
import type { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateProfile?: (updatedData: Partial<User>) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [vtuNo, setVtuNo] = useState(currentUser.vtuNo || '');
  const [ttsNo, setTtsNo] = useState(currentUser.ttsNo || '');
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science');
  const [year, setYear] = useState(currentUser.year || '3rd Year');
  const [designation, setDesignation] = useState(currentUser.designation || 'Assistant Professor');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    setName(currentUser.name || '');
    setVtuNo(currentUser.vtuNo || '');
    setTtsNo(currentUser.ttsNo || '');
    setDepartment(currentUser.department || 'Computer Science');
    setYear(currentUser.year || '3rd Year');
    setDesignation(currentUser.designation || 'Assistant Professor');
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setStatusMsg('❌ Full Name must be at least 2 characters.');
      return;
    }

    if (currentUser.role === 'student' && (!vtuNo.trim() || vtuNo.trim().length < 2)) {
      setStatusMsg('❌ VTU No. (College Student ID) is mandatory.');
      return;
    }

    if (currentUser.role === 'staff' && (!ttsNo.trim() || ttsNo.trim().length < 2)) {
      setStatusMsg('❌ TTS Number (College Staff ID) is mandatory.');
      return;
    }

    setIsSaving(true);
    try {
      if (onUpdateProfile) {
        await onUpdateProfile({
          name: name.trim(),
          vtuNo: currentUser.role === 'student' ? vtuNo.trim().toUpperCase() : undefined,
          ttsNo: currentUser.role === 'staff' ? ttsNo.trim().toUpperCase() : undefined,
          department: department.trim(),
          year: currentUser.role === 'student' ? year : undefined,
          designation: currentUser.role === 'staff' ? designation : undefined
        });
      }
      setIsSaving(false);
      setIsEditing(false);
      setStatusMsg('✅ Account profile details updated successfully!');
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setIsSaving(false);
      setStatusMsg('❌ Failed to update profile details.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '520px', 
          padding: '0', 
          borderRadius: '20px', 
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)'
        }}
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
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              Account Settings & Profile
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              View or edit your registered college details.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Edit3 size={14} color="#0066ff" /> Edit Profile
              </button>
            )}
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
        </div>

        {/* Content Body */}
        <form onSubmit={handleSaveProfile} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User Role Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #dbeafe'
          }}>
            <ShieldCheck size={20} color="#2563eb" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>ACCOUNT TYPE</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>
                {currentUser.role} Account
              </span>
            </div>
          </div>

          {/* Status Alert Banner */}
          {statusMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: statusMsg.includes('✅') ? '#f0fdf4' : '#fef2f2',
              color: statusMsg.includes('✅') ? '#15803d' : '#dc2626',
              border: statusMsg.includes('✅') ? '1px solid #bbf7d0' : '1px solid #fecaca'
            }}>
              {statusMsg}
            </div>
          )}

          {/* Full Name Field */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Name *</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                <UserIcon size={18} color="#64748b" /> {currentUser.name}
              </div>
            )}
          </div>

          {/* College Email (Read-Only) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>College Email</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>
              <Mail size={18} color="#94a3b8" /> {currentUser.email}
            </div>
          </div>

          {/* Student Specific Fields */}
          {currentUser.role === 'student' && (
            <>
              {/* VTU No */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.78rem', color: '#0066ff' }}>VTU No. (College Student ID) *</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={vtuNo}
                    onChange={(e) => setVtuNo(e.target.value.toUpperCase())}
                    placeholder="e.g. VTU30363 or 1VT21CS001"
                    style={{ fontWeight: 700, color: '#0066ff', textTransform: 'uppercase' }}
                    required
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f0f7ff', border: '1px solid #bfdbfe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IdCard size={18} color="#0066ff" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0066ff' }}>{currentUser.vtuNo || 'N/A'}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><Check size={14} /> Verified & Saved</span>
                  </div>
                )}
              </div>

              {/* Department & Academic Year Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Department</label>
                  {isEditing ? (
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Mechanical Eng">Mechanical Eng</option>
                      <option value="Electrical Eng">Electrical Eng</option>
                      <option value="Civil Eng">Civil Eng</option>
                      <option value="Information Science">Information Science</option>
                    </select>
                  ) : (
                    <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700 }}>
                      {currentUser.department || 'Computer Science'}
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Academic Year</label>
                  {isEditing ? (
                    <select
                      className="form-select"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  ) : (
                    <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700 }}>
                      {currentUser.year || '3rd Year'}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Staff Specific Fields */}
          {currentUser.role === 'staff' && (
            <>
              {/* TTS Number */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.78rem', color: '#0066ff' }}>TTS Number (College Staff ID) *</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={ttsNo}
                    onChange={(e) => setTtsNo(e.target.value.toUpperCase())}
                    placeholder="e.g. TTS9042"
                    style={{ fontWeight: 700, color: '#0066ff', textTransform: 'uppercase' }}
                    required
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f0f7ff', border: '1px solid #bfdbfe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IdCard size={18} color="#0066ff" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0066ff' }}>{currentUser.ttsNo || 'N/A'}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><Check size={14} /> Verified & Saved</span>
                  </div>
                )}
              </div>

              {/* Designation */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Designation</label>
                {isEditing ? (
                  <select
                    className="form-select"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor / Senior Professor">Professor / Senior Professor</option>
                    <option value="Lab Assistant / Technical Staff">Lab Assistant / Technical Staff</option>
                    <option value="Facility Maintenance Staff">Facility Maintenance Staff</option>
                  </select>
                ) : (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700 }}>
                    {currentUser.designation || 'Assistant Professor'}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Footer */}
          <div style={{
            marginTop: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save & Update Profile'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-dark"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Close Settings
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
