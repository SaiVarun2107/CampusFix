import React, { useState } from 'react';
import { X, Camera, Image as ImageIcon, Send } from 'lucide-react';
import type { Issue, IssueCategory, PriorityLevel, User } from '../types';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newIssueData: Omit<Issue, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'activityLog' | 'progressPercent' | 'adminApproval'>) => void;
  currentUser: User;
}

const PRESET_PHOTOS = [
  { label: 'Projector Fault', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600' },
  { label: 'Pipe Leakage', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600' },
  { label: 'HVAC Air Unit', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600' },
  { label: 'Lighting Issue', url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=600' }
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('IT & AV Equipment');
  const [block, setBlock] = useState('CSE Block');
  const [floor, setFloor] = useState('3rd Floor');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !room.trim() || !description.trim()) {
      alert('Please fill out all required fields (Title, Room/Area, and Description).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        title,
        category,
        location: { block, floor, room },
        description,
        priority,
        attachmentUrl: attachmentUrl || PRESET_PHOTOS[0].url,
        status: 'Pending',
        reporter: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          department: currentUser.department
        }
      });
      setIsSubmitting(false);
      // Reset form
      setTitle('');
      setRoom('');
      setDescription('');
      setAttachmentUrl('');
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '640px', 
          padding: '0', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
      >
        {/* Sticky Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              Report New Campus Issue
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Submit facility or maintenance request for quick resolution.
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            {/* Issue Title */}
            <div className="form-group">
              <label className="form-label">Issue Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Projector flickering in Room 304"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category & Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                >
                  <option value="IT & AV Equipment">💻 IT & AV Equipment</option>
                  <option value="Plumbing & Water">💧 Plumbing & Water</option>
                  <option value="Electrical & Lighting">⚡ Electrical & Lighting</option>
                  <option value="Furniture & Fixtures">🪑 Furniture & Fixtures</option>
                  <option value="HVAC & Cooling">❄️ HVAC & Cooling</option>
                  <option value="Custodial Services">🧹 Custodial Services</option>
                  <option value="Structural & Grounds">🏗️ Structural & Grounds</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority Level *</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                >
                  <option value="Low">Low - Normal Maintenance</option>
                  <option value="Medium">Medium - Standard Request</option>
                  <option value="High">High - Impairing Class / Work</option>
                  <option value="Urgent">Urgent - Emergency Safety / Spill</option>
                </select>
              </div>
            </div>

            {/* Cascading Location Section */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'block', marginBottom: '10px' }}>
                📍 Location Details
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Block / Building</label>
                  <select
                    className="form-select"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="CSE Block">CSE Block</option>
                    <option value="Science Bldg">Science Bldg</option>
                    <option value="Engineering Block">Engineering Block</option>
                    <option value="Main Library">Main Library</option>
                    <option value="Student Union">Student Union</option>
                    <option value="Hostel Block A">Hostel Block A</option>
                    <option value="Hostel Block B">Hostel Block B</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Floor</label>
                  <select
                    className="form-select"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                    <option value="4th Floor">4th Floor</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Room / Specific Area *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Room 304 / Washroom 2B"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Issue Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Provide specific details about what is wrong..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Attachment Option */}
            <div className="form-group">
              <label className="form-label">Attachment (Image of Issue)</label>
              
              <div style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                marginBottom: '10px'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Camera size={24} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {attachmentUrl ? 'Change Uploaded Photo' : 'Click to Upload Photo or Drag & Drop'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PNG, JPG up to 5MB</span>
                </label>
              </div>

              {/* Quick Sample Photo Presets */}
              <div style={{ marginTop: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Or select a sample photo:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAttachmentUrl(preset.url)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: attachmentUrl === preset.url ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                        backgroundColor: attachmentUrl === preset.url ? '#eff6ff' : '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <ImageIcon size={12} /> {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {attachmentUrl && (
                <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                  <img
                    src={attachmentUrl}
                    alt="Attachment preview"
                    style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                  />
                  <button
                    type="button"
                    onClick={() => setAttachmentUrl('')}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer Form Action Buttons */}
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.04)'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ padding: '10px 24px', fontWeight: 700, gap: '6px' }}
            >
              <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Report Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
