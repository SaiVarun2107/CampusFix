import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize TiDB Connection Pool
const dbPool = mysql.createPool({
  host: process.env.TIDB_HOST,
  port: Number(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE || 'campusfix_db',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Helper function to format issue DB rows
async function formatIssueRow(pool, row) {
  const [logs] = await pool.query(
    'SELECT * FROM activity_logs WHERE issue_id = ? ORDER BY created_at DESC',
    [row.id]
  );

  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    title: row.title,
    category: row.category,
    location: {
      block: row.block,
      floor: row.floor,
      room: row.room
    },
    description: row.description,
    priority: row.priority,
    attachmentUrl: row.attachment_url,
    status: row.status,
    progressPercent: row.progress_percent,
    reporter: {
      id: row.reporter_id,
      name: row.reporter_name || 'Student',
      email: row.reporter_email || '',
      department: row.reporter_dept
    },
    assignedStaff: row.assigned_staff_id ? {
      id: row.assigned_staff_id,
      name: row.staff_name || 'Maintenance Tech',
      email: row.staff_email || '',
      department: row.staff_dept || 'Facilities'
    } : null,
    adminApproval: {
      requested: row.status === 'Pending Approval' || Boolean(row.admin_approved),
      requestedAt: row.created_at,
      approved: Boolean(row.admin_approved),
      approvedAt: row.admin_approved_at,
      approvedByAdminName: row.admin_approved_by,
      adminComment: row.admin_comment
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolutionNotes: row.resolution_notes,
    activityLog: logs.map(l => ({
      id: l.id,
      text: l.text,
      timestamp: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: l.actor_name,
      actorRole: l.actor_role
    }))
  };
}

// 1. Health & Connection Test Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT VERSION() as version, DATABASE() as db_name');
    res.json({
      status: 'online',
      connected: true,
      tidbVersion: rows[0].version,
      database: rows[0].db_name,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', connected: false, error: err.message });
  }
});

// 2. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [users] = await dbPool.query('SELECT * FROM users WHERE email = ?', [email.trim()]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      vtuNo: user.vtu_no,
      ttsNo: user.tts_no,
      designation: user.designation,
      avatarUrl: user.avatar_url
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2.2 Update Full User Profile in Database
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, department, year, vtuNo, ttsNo, designation } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  }

  const cleanName = name.trim();
  const cleanVtu = vtuNo ? vtuNo.trim().toUpperCase() : null;
  const cleanTts = ttsNo ? ttsNo.trim().toUpperCase() : null;
  const cleanDept = department ? department.trim() : null;
  const cleanYear = year ? year.trim() : null;
  const cleanDesig = designation ? designation.trim() : null;

  try {
    const [existing] = await dbPool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (existing.length === 0) {
      await dbPool.query(
        `INSERT INTO users (id, name, email, password_hash, role, department, year, vtu_no, tts_no, designation, avatar_url)
         VALUES (?, ?, 'user@university.edu', 'pass123', 'student', ?, ?, ?, ?, ?, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')`,
        [id, cleanName, cleanDept, cleanYear, cleanVtu, cleanTts, cleanDesig]
      );
    } else {
      await dbPool.query(
        `UPDATE users 
         SET name = ?, department = ?, year = ?, vtu_no = ?, tts_no = ?, designation = ?
         WHERE id = ?`,
        [cleanName, cleanDept, cleanYear, cleanVtu, cleanTts, cleanDesig, id]
      );
    }

    res.json({
      success: true,
      user: {
        id,
        name: cleanName,
        department: cleanDept,
        year: cleanYear,
        vtuNo: cleanVtu,
        ttsNo: cleanTts,
        designation: cleanDesig
      }
    });
  } catch (err) {
    console.error('Error updating user profile in database:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Auth: Sign Up
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role, department, year, vtuNo, ttsNo, designation } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Full name must be at least 2 characters.' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  // Mandatory VTU No for Students
  if (role === 'student') {
    if (!vtuNo || vtuNo.trim().length < 2) {
      return res.status(400).json({ error: 'VTU No. (College Student ID) is mandatory for students.' });
    }
  }

  // Mandatory TTS No for Staff
  if (role === 'staff') {
    if (!ttsNo || ttsNo.trim().length < 2) {
      return res.status(400).json({ error: 'TTS Number (College Staff ID) is mandatory for staff.' });
    }
  }

  const userId = `user_${role}_${Date.now()}`;
  const avatarUrl = role === 'student'
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250';

  try {
    // Check if email already exists
    const [existing] = await dbPool.query('SELECT id FROM users WHERE email = ?', [email.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    await dbPool.query(
      'INSERT INTO users (id, name, email, password_hash, role, department, year, vtu_no, tts_no, designation, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId, 
        name.trim(), 
        email.trim(), 
        password, 
        role, 
        role === 'student' ? (department || null) : null, 
        role === 'student' ? (year || null) : null, 
        vtuNo ? vtuNo.trim().toUpperCase() : null, 
        ttsNo ? ttsNo.trim().toUpperCase() : null, 
        role === 'staff' ? (designation || 'Assistant Professor') : null, 
        avatarUrl
      ]
    );

    res.status(201).json({
      id: userId,
      name: name.trim(),
      email: email.trim(),
      role,
      department: role === 'student' ? department : undefined,
      year: role === 'student' ? year : undefined,
      vtuNo: vtuNo ? vtuNo.trim().toUpperCase() : undefined,
      ttsNo: ttsNo ? ttsNo.trim().toUpperCase() : undefined,
      designation: role === 'staff' ? designation : undefined,
      avatarUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get All Issues
app.get('/api/issues', async (req, res) => {
  try {
    const query = `
      SELECT 
        i.*,
        u1.name as reporter_name, u1.email as reporter_email, u1.department as reporter_dept,
        u2.name as staff_name, u2.email as staff_email, u2.department as staff_dept
      FROM issues i
      LEFT JOIN users u1 ON i.reporter_id = u1.id
      LEFT JOIN users u2 ON i.assigned_staff_id = u2.id
      ORDER BY i.created_at DESC
    `;
    const [rows] = await dbPool.query(query);

    const issues = await Promise.all(rows.map(row => formatIssueRow(dbPool, row)));
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Create New Issue (Student)
app.post('/api/issues', async (req, res) => {
  const { title, category, location, description, priority, attachmentUrl, reporterId, reporterName, reporterEmail, reporterDept } = req.body;

  if (!title || !description || !location?.room || !reporterId) {
    return res.status(400).json({ error: 'Missing required issue fields.' });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const issueId = `issue-${randomNum}`;
  const ticketNumber = `#CF${randomNum}`;

  // Optimize attachmentUrl if base64 data URI is too large (> 64KB)
  let safeAttachmentUrl = attachmentUrl || null;
  if (safeAttachmentUrl && safeAttachmentUrl.length > 65535) {
    // Truncate huge base64 or fallback to standard sample photo to prevent ECONNRESET socket disconnect
    safeAttachmentUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600';
  }

  try {
    // Ensure reporter exists in users table to prevent FK constraint failure
    if (reporterId) {
      await dbPool.query(
        `INSERT IGNORE INTO users (id, name, email, password_hash, role, department, avatar_url)
         VALUES (?, ?, ?, 'student123', 'student', ?, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')`,
        [reporterId, reporterName || 'Student', reporterEmail || `${reporterId}@university.edu`, reporterDept || 'Student']
      );
    }

    await dbPool.query(
      `INSERT INTO issues (id, ticket_number, title, category, block, floor, room, description, priority, attachment_url, status, progress_percent, reporter_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 0, ?)`,
      [
        issueId,
        ticketNumber,
        title.trim(),
        category || 'IT & AV Equipment',
        location.block || 'Main Block',
        location.floor || 'Ground Floor',
        location.room.trim(),
        description.trim(),
        priority || 'Medium',
        safeAttachmentUrl,
        reporterId
      ]
    );

    // Insert activity log
    const logId = `act-${Date.now()}`;
    await dbPool.query(
      'INSERT INTO activity_logs (id, issue_id, text, actor_name, actor_role) VALUES (?, ?, ?, ?, ?)',
      [logId, issueId, `Report submitted by ${reporterName || 'Student'}`, reporterName || 'Student', 'student']
    );

    // Fetch newly created issue
    const [rows] = await dbPool.query(
      `SELECT i.*, u1.name as reporter_name, u1.email as reporter_email, u1.department as reporter_dept
       FROM issues i LEFT JOIN users u1 ON i.reporter_id = u1.id WHERE i.id = ?`,
      [issueId]
    );

    const createdIssue = await formatIssueRow(dbPool, rows[0]);
    res.status(201).json(createdIssue);
  } catch (err) {
    console.error('Error inserting issue into TiDB:', err);
    res.status(500).json({ error: 'Database error while saving issue report. Please try again.' });
  }
});

// 6. Staff Request Admin Approval Workflow
app.put('/api/issues/:id/request-approval', async (req, res) => {
  const { id } = req.params;
  const { staffId, staffName } = req.body;

  try {
    await dbPool.query(
      `UPDATE issues 
       SET status = 'Pending Approval', assigned_staff_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [staffId || 'user_staff_1', id]
    );

    const logId = `act-${Date.now()}`;
    await dbPool.query(
      'INSERT INTO activity_logs (id, issue_id, text, actor_name, actor_role) VALUES (?, ?, ?, ?, ?)',
      [logId, id, `Staff (${staffName || 'Robert Hayes'}) requested Admin work approval`, staffName || 'Robert Hayes', 'staff']
    );

    res.json({ success: true, status: 'Pending Approval' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Admin Grant Approval Workflow
app.put('/api/issues/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { adminName, adminComment } = req.body;

  try {
    await dbPool.query(
      `UPDATE issues 
       SET status = 'In Progress', progress_percent = GREATEST(progress_percent, 25), admin_approved = TRUE, admin_approved_at = CURRENT_TIMESTAMP, admin_approved_by = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [adminName || 'Dr. Eleanor Vance', adminComment || 'Approved by Admin', id]
    );

    const logId = `act-${Date.now()}`;
    await dbPool.query(
      'INSERT INTO activity_logs (id, issue_id, text, actor_name, actor_role) VALUES (?, ?, ?, ?, ?)',
      [logId, id, `Admin (${adminName || 'Dr. Eleanor Vance'}) APPROVED work: "${adminComment || 'Approved'}"`, adminName || 'Dr. Eleanor Vance', 'admin']
    );

    res.json({ success: true, status: 'In Progress', approved: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Staff Update Progress & Resolve
app.put('/api/issues/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { staffName, progressPercent, notes } = req.body;

  const isResolved = Number(progressPercent) >= 100;
  const newStatus = isResolved ? 'Resolved' : 'In Progress';

  try {
    await dbPool.query(
      `UPDATE issues 
       SET status = ?, progress_percent = ?, resolution_notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newStatus, Number(progressPercent), notes || null, id]
    );

    const logId = `act-${Date.now()}`;
    const logText = isResolved
      ? `Issue RESOLVED by ${staffName || 'Staff'}: ${notes || 'Fixed'}`
      : `Progress updated to ${progressPercent}%: ${notes || 'Updated'}`;

    await dbPool.query(
      'INSERT INTO activity_logs (id, issue_id, text, actor_name, actor_role) VALUES (?, ?, ?, ?, ?)',
      [logId, id, logText, staffName || 'Staff', 'staff']
    );

    res.json({ success: true, status: newStatus, progressPercent: Number(progressPercent) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CampusFix Express Server running on http://localhost:${PORT}`);
});
