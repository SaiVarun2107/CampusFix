export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  year?: string;
  vtuNo?: string;
  ttsNo?: string;
  designation?: string;
  avatarUrl?: string;
}

export type IssueCategory =
  | 'Plumbing & Water'
  | 'Electrical & Lighting'
  | 'IT & AV Equipment'
  | 'Furniture & Fixtures'
  | 'HVAC & Cooling'
  | 'Custodial Services'
  | 'Structural & Grounds';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type IssueStatus = 'Pending' | 'Pending Approval' | 'In Progress' | 'Resolved';

export interface LocationInfo {
  block: string;
  floor: string;
  room: string;
}

export interface ActivityLogItem {
  id: string;
  text: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
}

export interface AdminApprovalDetails {
  requested: boolean;
  requestedAt?: string;
  requestedByStaffId?: string;
  requestedByStaffName?: string;
  approved: boolean;
  approvedAt?: string;
  approvedByAdminName?: string;
  adminComment?: string;
  rejected?: boolean;
}

export interface Issue {
  id: string;
  ticketNumber: string;
  title: string;
  category: IssueCategory;
  location: LocationInfo;
  description: string;
  priority: PriorityLevel;
  attachmentUrl?: string;
  status: IssueStatus;
  progressPercent: number;
  reporter: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
  assignedStaff?: {
    id: string;
    name: string;
    email: string;
    department: string;
  } | null;
  adminApproval: AdminApprovalDetails;
  createdAt: string;
  updatedAt: string;
  activityLog: ActivityLogItem[];
  resolutionNotes?: string;
  resolutionPhoto?: string;
}

export interface CategoryStat {
  category: IssueCategory;
  count: number;
  resolvedCount: number;
  color: string;
}

export interface CampusStats {
  totalIssues: number;
  pending: number;
  pendingApproval: number;
  inProgress: number;
  resolved: number;
  satisfactionRate: number;
  activeMembers: number;
}
