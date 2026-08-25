import React from 'react';
import { X, User as UserIcon, Mail, IdCard, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import type { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '480px', 
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              Account Settings & Details
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Your registered college account details.
            </p>
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
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          {/* Full Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <UserIcon size={20} color="#64748b" />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Full Name</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.name}</span>
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <Mail size={20} color="#64748b" />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>College Email</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.email}</span>
            </div>
          </div>

          {/* Student Specific Fields */}
          {currentUser.role === 'student' && (
            <>
              {/* VTU No */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <IdCard size={20} color="#64748b" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>VTU No. (College Student ID)</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0066ff' }}>
                    {currentUser.vtuNo || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Department & Year */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Department</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.department || 'Computer Science'}</span>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Academic Year</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.year || '3rd Year'}</span>
                </div>
              </div>
            </>
          )}

          {/* Staff Specific Fields */}
          {currentUser.role === 'staff' && (
            <>
              {/* TTS Number */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <IdCard size={20} color="#64748b" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>TTS Number (College Staff ID)</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0066ff' }}>
                    {currentUser.ttsNo || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Designation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <Briefcase size={20} color="#64748b" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Designation</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    {currentUser.designation || 'Assistant Professor'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Admin Specific Fields */}
          {currentUser.role === 'admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <GraduationCap size={20} color="#64748b" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Administrative Division</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.department || 'Campus Infrastructure Directorate'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="btn btn-dark"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
