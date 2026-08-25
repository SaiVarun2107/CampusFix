import type { Issue, User, CampusStats, CategoryStat, UserRole } from '../types';

const STORAGE_KEY_ISSUES = 'campusfix_issues_v1';
const STORAGE_KEY_USER = 'campusfix_current_user_v1';

// Initial pre-loaded mock users matching screenshots
export const DEMO_USERS: Record<UserRole, User> = {
  student: {
    id: 'user_student_1',
    name: 'Sai Varun',
    email: 'varun.student@university.edu',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  staff: {
    id: 'user_staff_1',
    name: 'Robert Hayes',
    email: 'robert.staff@university.edu',
    role: 'staff',
    department: 'Facilities Maintenance & IT Support',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  },
  admin: {
    id: 'user_admin_1',
    name: 'Dr. Eleanor Vance',
    email: 'admin.director@university.edu',
    role: 'admin',
    department: 'Campus Infrastructure & Ops',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  }
};

// Default seed issues matching the Stitch UI design screenshots
const INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-1024',
    ticketNumber: '#CF1024',
    title: 'Projector not working',
    category: 'IT & AV Equipment',
    location: {
      block: 'CSE Block',
      floor: '3rd Floor',
      room: 'Room 304'
    },
    description: 'The ceiling projector HDMI port is loose and bulb flickers intermittently during lectures.',
    priority: 'High',
    attachmentUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    status: 'In Progress',
    progressPercent: 45,
    reporter: {
      id: 'user_student_1',
      name: 'Sai Varun',
      email: 'varun.student@university.edu',
      department: 'Computer Science'
    },
    assignedStaff: {
      id: 'user_staff_1',
      name: 'Robert Hayes',
      email: 'robert.staff@university.edu',
      department: 'IT & AV Support'
    },
    adminApproval: {
      requested: true,
      requestedAt: '2026-08-25T10:15:00Z',
      requestedByStaffId: 'user_staff_1',
      requestedByStaffName: 'Robert Hayes',
      approved: true,
      approvedAt: '2026-08-25T11:00:00Z',
      approvedByAdminName: 'Dr. Eleanor Vance',
      adminComment: 'Approved for urgent replacement bulb order.'
    },
    createdAt: '2026-08-25T09:30:00Z',
    updatedAt: '2026-08-25T14:20:00Z',
    activityLog: [
      {
        id: 'act-1',
        text: 'Report submitted by Sai Varun',
        timestamp: '2 hours ago',
        actor: 'Sai Varun',
        actorRole: 'student'
      },
      {
        id: 'act-2',
        text: 'Maintenance staff (Robert Hayes) assigned & requested work approval',
        timestamp: '1 hour ago',
        actor: 'Robert Hayes',
        actorRole: 'staff'
      },
      {
        id: 'act-3',
        text: 'Work approval GRANTED by Admin (Dr. Eleanor Vance)',
        timestamp: '45 mins ago',
        actor: 'Dr. Eleanor Vance',
        actorRole: 'admin'
      },
      {
        id: 'act-4',
        text: 'Work in progress: Replacement bulb dispatched to Room 304',
        timestamp: '20 mins ago',
        actor: 'Robert Hayes',
        actorRole: 'staff'
      }
    ]
  },
  {
    id: 'issue-1023',
    ticketNumber: '#CF1023',
    title: 'Wi-Fi connectivity drop',
    category: 'IT & AV Equipment',
    location: {
      block: 'Hostel Block A',
      floor: '2nd Floor',
      room: 'Corridor Access Point 2B'
    },
    description: 'Frequent network drops and weak signal in the east wing study corridor.',
    priority: 'Medium',
    status: 'Pending',
    progressPercent: 0,
    reporter: {
      id: 'user_student_1',
      name: 'Sai Varun',
      email: 'varun.student@university.edu',
      department: 'Computer Science'
    },
    adminApproval: {
      requested: false,
      approved: false
    },
    createdAt: '2026-08-24T18:45:00Z',
    updatedAt: '2026-08-24T18:45:00Z',
    activityLog: [
      {
        id: 'act-10',
        text: 'Report submitted by Sai Varun',
        timestamp: 'Yesterday',
        actor: 'Sai Varun',
        actorRole: 'student'
      }
    ]
  },
  {
    id: 'issue-1022',
    ticketNumber: '#CF1022',
    title: 'Leaking Pipe under Sink',
    category: 'Plumbing & Water',
    location: {
      block: 'Main Library',
      floor: '1st Floor',
      room: 'Restroom 102'
    },
    description: 'Water leaking steadily from supply valve onto floor.',
    priority: 'High',
    attachmentUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
    status: 'Pending Approval',
    progressPercent: 10,
    reporter: {
      id: 'user_student_2',
      name: 'Ananya Sharma',
      email: 'ananya@university.edu',
      department: 'Biotechnology'
    },
    assignedStaff: {
      id: 'user_staff_1',
      name: 'Robert Hayes',
      email: 'robert.staff@university.edu',
      department: 'Plumbing & Maintenance'
    },
    adminApproval: {
      requested: true,
      requestedAt: '2026-08-25T12:00:00Z',
      requestedByStaffId: 'user_staff_1',
      requestedByStaffName: 'Robert Hayes',
      approved: false
    },
    createdAt: '2026-08-25T08:00:00Z',
    updatedAt: '2026-08-25T12:00:00Z',
    activityLog: [
      {
        id: 'act-20',
        text: 'Report submitted by Ananya Sharma',
        timestamp: '5 hours ago',
        actor: 'Ananya Sharma',
        actorRole: 'student'
      },
      {
        id: 'act-21',
        text: 'Staff requested Admin Approval to initiate plumbing replacement',
        timestamp: '3 hours ago',
        actor: 'Robert Hayes',
        actorRole: 'staff'
      }
    ]
  },
  {
    id: 'issue-4928',
    ticketNumber: '#CF4928',
    title: 'HVAC Air Cooling Repair',
    category: 'HVAC & Cooling',
    location: {
      block: 'Science Bldg',
      floor: '3rd Floor',
      room: 'Room 302'
    },
    description: 'AC unit blowing lukewarm air; thermostat sensor uncalibrated.',
    priority: 'Urgent',
    attachmentUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    status: 'Resolved',
    progressPercent: 100,
    reporter: {
      id: 'user_student_3',
      name: 'Michael Chang',
      email: 'michael.c@university.edu',
      department: 'Physics'
    },
    assignedStaff: {
      id: 'user_staff_1',
      name: 'Robert Hayes',
      email: 'robert.staff@university.edu',
      department: 'HVAC Specialist'
    },
    adminApproval: {
      requested: true,
      requestedAt: '2026-08-24T09:00:00Z',
      requestedByStaffId: 'user_staff_1',
      approved: true,
      approvedAt: '2026-08-24T09:30:00Z',
      approvedByAdminName: 'Dr. Eleanor Vance'
    },
    createdAt: '2026-08-24T08:00:00Z',
    updatedAt: '2026-08-24T16:30:00Z',
    resolutionNotes: 'Replaced compressor valve & recharged coolant gas. System tested at optimal 20°C cooling.',
    activityLog: [
      {
        id: 'act-30',
        text: 'Issue reported by Michael Chang',
        timestamp: 'Yesterday',
        actor: 'Michael Chang',
        actorRole: 'student'
      },
      {
        id: 'act-31',
        text: 'Admin approved work order',
        timestamp: 'Yesterday',
        actor: 'Dr. Eleanor Vance',
        actorRole: 'admin'
      },
      {
        id: 'act-32',
        text: 'HVAC repaired and marked resolved',
        timestamp: 'Yesterday',
        actor: 'Robert Hayes',
        actorRole: 'staff'
      }
    ]
  },
  {
    id: 'issue-4927',
    ticketNumber: '#CF4927',
    title: 'Flickering Overhead Lights',
    category: 'Electrical & Lighting',
    location: {
      block: 'Student Union',
      floor: 'Ground Floor',
      room: 'Cafeteria Main Hall'
    },
    description: 'Multiple LED panels humming and flickering near dining counters.',
    priority: 'Medium',
    status: 'Resolved',
    progressPercent: 100,
    reporter: {
      id: 'user_student_1',
      name: 'Sai Varun',
      email: 'varun.student@university.edu',
      department: 'Computer Science'
    },
    assignedStaff: {
      id: 'user_staff_1',
      name: 'Robert Hayes',
      email: 'robert.staff@university.edu',
      department: 'Electrical Team'
    },
    adminApproval: {
      requested: true,
      approved: true,
      approvedAt: '2026-08-23T10:00:00Z'
    },
    createdAt: '2026-08-23T09:00:00Z',
    updatedAt: '2026-08-23T15:00:00Z',
    resolutionNotes: 'Replaced 4 faulty LED drivers and secured wiring.',
    activityLog: [
      {
        id: 'act-40',
        text: 'Issue reported and resolved',
        timestamp: '2 days ago',
        actor: 'Robert Hayes',
        actorRole: 'staff'
      }
    ]
  },
  {
    id: 'issue-4926',
    ticketNumber: '#CF4926',
    title: 'Broken Desk Chairs in Seminar Hall',
    category: 'Furniture & Fixtures',
    location: {
      block: 'Humanities Bldg',
      floor: '2nd Floor',
      room: 'Lecture Hall B'
    },
    description: 'Three desk chairs have broken hydraulic armrests.',
    priority: 'Low',
    status: 'Resolved',
    progressPercent: 100,
    reporter: {
      id: 'user_student_2',
      name: 'Ananya Sharma',
      email: 'ananya@university.edu'
    },
    adminApproval: {
      requested: true,
      approved: true
    },
    createdAt: '2026-08-22T14:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z',
    resolutionNotes: 'Chairs replaced with refurbished auditorium seating.',
    activityLog: [
      {
        id: 'act-50',
        text: 'Chairs swapped and replaced',
        timestamp: '3 days ago',
        actor: 'Robert Hayes',
        actorRole: 'staff'
      }
    ]
  }
];

export const getStoredIssues = (): Issue[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ISSUES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(INITIAL_ISSUES));
      return INITIAL_ISSUES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read issues from storage', e);
    return INITIAL_ISSUES;
  }
};

export const saveIssuesToStorage = (issues: Issue[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));
  } catch (e) {
    console.error('Failed to save issues to storage', e);
  }
};

export const getStoredUser = (): User => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read user from storage', e);
  }
  return DEMO_USERS.student; // Default to student
};

export const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to storage', e);
  }
};

export const calculateCampusStats = (issues: Issue[]): CampusStats => {
  const totalIssues = issues.length;
  const pending = issues.filter(i => i.status === 'Pending').length;
  const pendingApproval = issues.filter(i => i.status === 'Pending Approval').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;

  return {
    totalIssues,
    pending,
    pendingApproval,
    inProgress,
    resolved,
    satisfactionRate: 98,
    activeMembers: 8902
  };
};

export const calculateCategoryStats = (issues: Issue[]): CategoryStat[] => {
  const categoryMap: Record<string, { total: number; resolved: number; color: string }> = {
    'Plumbing & Water': { total: 0, resolved: 0, color: '#2563eb' },
    'Electrical & Lighting': { total: 0, resolved: 0, color: '#3b82f6' },
    'IT & AV Equipment': { total: 0, resolved: 0, color: '#0284c7' },
    'Furniture & Fixtures': { total: 0, resolved: 0, color: '#64748b' },
    'HVAC & Cooling': { total: 0, resolved: 0, color: '#0d9488' },
    'Custodial Services': { total: 0, resolved: 0, color: '#f59e0b' },
    'Structural & Grounds': { total: 0, resolved: 0, color: '#8b5cf6' }
  };

  issues.forEach(issue => {
    if (!categoryMap[issue.category]) {
      categoryMap[issue.category] = { total: 0, resolved: 0, color: '#3b82f6' };
    }
    categoryMap[issue.category].total += 1;
    if (issue.status === 'Resolved') {
      categoryMap[issue.category].resolved += 1;
    }
  });

  return Object.keys(categoryMap).map(cat => ({
    category: cat as any,
    count: categoryMap[cat].total,
    resolvedCount: categoryMap[cat].resolved,
    color: categoryMap[cat].color
  }));
};

const STORAGE_KEY_NOTIF = 'campusfix_notifications_v1';

export const INITIAL_NOTIFICATIONS: import('../types').NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'staff',
    title: '🛡️ Work Authorization Granted',
    message: 'Admin (Dr. Eleanor Vance) APPROVED work for ticket #CF1024 (Projector not working): "Approved for bulb replacement."',
    issueId: 'issue-1024',
    ticketNumber: '#CF1024',
    type: 'approval',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'notif-2',
    targetRole: 'staff',
    title: '🛡️ Admin Work Approval Granted',
    message: 'Admin (Dr. Eleanor Vance) APPROVED work for ticket #CF1024 (Projector not working): "Approved for immediate fix".',
    issueId: 'issue-1024',
    ticketNumber: '#CF1024',
    type: 'approval',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'notif-3',
    targetRole: 'student',
    targetUserId: 'user_student_1',
    title: '🔧 Progress Updated (45%)',
    message: 'Work progress on your report #CF1024 (Projector not working) updated to 45%.',
    issueId: 'issue-1024',
    ticketNumber: '#CF1024',
    type: 'progress',
    timestamp: '20 mins ago',
    read: false
  },
  {
    id: 'notif-4',
    targetRole: 'student',
    targetUserId: 'user_student_1',
    title: '🎉 Issue Resolved!',
    message: 'Your reported issue #CF4928 (HVAC Air Cooling Repair) was marked fully resolved (100%).',
    issueId: 'issue-4928',
    ticketNumber: '#CF4928',
    type: 'resolved',
    timestamp: 'Yesterday',
    read: true
  }
];

export const getStoredNotifications = (): import('../types').NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIF);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTIF, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read notifications from storage', e);
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotificationsToStorage = (notifications: import('../types').NotificationItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIF, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications to storage', e);
  }
};
