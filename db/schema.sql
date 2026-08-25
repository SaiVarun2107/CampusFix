-- TiDB Cloud Database Schema for CampusFix

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'staff', 'admin') NOT NULL,
  department VARCHAR(100),
  year VARCHAR(50),
  vtu_no VARCHAR(50),
  tts_no VARCHAR(50),
  designation VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issues (
  id VARCHAR(64) PRIMARY KEY,
  ticket_number VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  block VARCHAR(100) NOT NULL,
  floor VARCHAR(50) NOT NULL,
  room VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
  attachment_url TEXT,
  status ENUM('Pending', 'Pending Approval', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Pending',
  progress_percent INT DEFAULT 0,
  reporter_id VARCHAR(64) NOT NULL,
  assigned_staff_id VARCHAR(64),
  admin_approved BOOLEAN DEFAULT FALSE,
  admin_approved_at TIMESTAMP NULL,
  admin_approved_by VARCHAR(100),
  admin_comment TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  issue_id VARCHAR(64) NOT NULL,
  text TEXT NOT NULL,
  actor_name VARCHAR(100) NOT NULL,
  actor_role ENUM('student', 'staff', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

-- Seed Initial Demo Users
INSERT IGNORE INTO users (id, name, email, password_hash, role, department, year, avatar_url) VALUES
('user_student_1', 'Sai Varun', 'varun.student@university.edu', 'student123', 'student', 'Computer Science', '3rd Year', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'),
('user_staff_1', 'Robert Hayes', 'robert.staff@university.edu', 'staff123', 'staff', 'Facilities Maintenance', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'),
('user_admin_1', 'Dr. Eleanor Vance', 'admin.director@university.edu', 'admin123', 'admin', 'Campus Infrastructure', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250');

-- Seed Initial Issues
INSERT IGNORE INTO issues (id, ticket_number, title, category, block, floor, room, description, priority, attachment_url, status, progress_percent, reporter_id, assigned_staff_id, admin_approved, admin_comment) VALUES
('issue-1024', '#CF1024', 'Projector not working', 'IT & AV Equipment', 'CSE Block', '3rd Floor', 'Room 304', 'The ceiling projector HDMI port is loose and bulb flickers intermittently during lectures.', 'High', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600', 'In Progress', 45, 'user_student_1', 'user_staff_1', TRUE, 'Approved for bulb replacement.'),
('issue-1023', '#CF1023', 'Wi-Fi connectivity drop', 'IT & AV Equipment', 'Hostel Block A', '2nd Floor', 'Corridor Access Point 2B', 'Frequent network drops and weak signal in the east wing study corridor.', 'Medium', NULL, 'Pending', 0, 'user_student_1', NULL, FALSE, NULL),
('issue-1022', '#CF1022', 'Leaking Pipe under Sink', 'Plumbing & Water', 'Main Library', '1st Floor', 'Restroom 102', 'Water leaking steadily from supply valve onto floor.', 'High', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600', 'Pending Approval', 10, 'user_student_1', 'user_staff_1', FALSE, NULL),
('issue-4928', '#CF4928', 'HVAC Air Cooling Repair', 'HVAC & Cooling', 'Science Bldg', '3rd Floor', 'Room 302', 'AC unit blowing lukewarm air; thermostat sensor uncalibrated.', 'Urgent', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600', 'Resolved', 100, 'user_student_1', 'user_staff_1', TRUE, 'HVAC compressor replacement approved');

-- Seed Activity Logs
INSERT IGNORE INTO activity_logs (id, issue_id, text, actor_name, actor_role) VALUES
('act-1', 'issue-1024', 'Report submitted by Sai Varun', 'Sai Varun', 'student'),
('act-2', 'issue-1024', 'Maintenance staff (Robert Hayes) assigned & requested work approval', 'Robert Hayes', 'staff'),
('act-3', 'issue-1024', 'Work approval GRANTED by Admin (Dr. Eleanor Vance)', 'Dr. Eleanor Vance', 'admin'),
('act-4', 'issue-1023', 'Report submitted by Sai Varun', 'Sai Varun', 'student');
