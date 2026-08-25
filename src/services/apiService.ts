import type { Issue, User } from '../types';
import { getStoredIssues, saveIssuesToStorage } from './storageService';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // 1. Health check
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      return data.connected;
    } catch (e) {
      console.error('API Health check failed', e);
      return false;
    }
  },

  // 2. Fetch all issues (TiDB Cloud API + fallback to local storage)
  async getIssues(): Promise<Issue[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues`);
      if (!res.ok) throw new Error('Failed to fetch issues');
      const apiIssues: Issue[] = await res.json();
      if (Array.isArray(apiIssues) && apiIssues.length > 0) {
        saveIssuesToStorage(apiIssues);
        return apiIssues;
      }
      const localIssues = getStoredIssues();
      return localIssues.length > 0 ? localIssues : apiIssues;
    } catch (e) {
      console.warn('Failed to load issues from backend API, falling back to stored issues', e);
      return getStoredIssues();
    }
  },

  // 3. Auth: Login
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  },

  // 4. Auth: Sign Up
  async signup(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    department?: string;
    year?: string;
    vtuNo?: string;
    ttsNo?: string;
    designation?: string;
  }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Sign up failed');
    }
    return data;
  },

  // 5. Create New Issue (Student) with guaranteed persistence
  async createIssue(issueData: {
    title: string;
    category: string;
    location: { block: string; floor: string; room: string };
    description: string;
    priority: string;
    attachmentUrl?: string;
    reporterId: string;
    reporterName: string;
    reporterEmail?: string;
    reporterDept?: string;
  }): Promise<Issue> {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newIssueId = `issue-${randomNum}`;
    const newTicketNum = `#CF${randomNum}`;
    const nowIso = new Date().toISOString();

    const localNewIssue: Issue = {
      id: newIssueId,
      ticketNumber: newTicketNum,
      title: issueData.title,
      category: issueData.category as any,
      location: issueData.location,
      description: issueData.description,
      priority: issueData.priority as any,
      attachmentUrl: issueData.attachmentUrl,
      status: 'Pending',
      progressPercent: 0,
      reporter: {
        id: issueData.reporterId,
        name: issueData.reporterName,
        email: issueData.reporterEmail || '',
        department: issueData.reporterDept
      },
      adminApproval: {
        requested: false,
        approved: false
      },
      createdAt: nowIso,
      updatedAt: nowIso,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          text: `Report submitted by ${issueData.reporterName || 'Student'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: issueData.reporterName || 'Student',
          actorRole: 'student'
        }
      ]
    };

    try {
      const res = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData)
      });
      if (res.ok) {
        const createdFromApi: Issue = await res.json();
        const existing = getStoredIssues();
        const merged = [createdFromApi, ...existing.filter(i => i.id !== createdFromApi.id)];
        saveIssuesToStorage(merged);
        return createdFromApi;
      }
    } catch (e) {
      console.warn('API createIssue failed, persisting locally:', e);
    }

    // Save locally if API endpoint unreachable or error
    const existing = getStoredIssues();
    const updatedList = [localNewIssue, ...existing];
    saveIssuesToStorage(updatedList);
    return localNewIssue;
  },

  // 6. Staff Request Admin Approval Workflow
  async requestApproval(issueId: string, staffId: string, staffName: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${issueId}/request-approval`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, staffName })
      });
      if (!res.ok) {
        const data = await res.json();
        console.warn('API requestApproval warn:', data.error);
      }
    } catch (e) {
      console.warn('API requestApproval failed:', e);
    }
  },

  // 7. Admin Grant Approval Workflow
  async approveWork(issueId: string, adminName: string, adminComment: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${issueId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName, adminComment })
      });
      if (!res.ok) {
        const data = await res.json();
        console.warn('API approveWork warn:', data.error);
      }
    } catch (e) {
      console.warn('API approveWork failed:', e);
    }
  },

  // 8. Staff Update Progress & Resolution
  async updateProgress(issueId: string, staffName: string, progressPercent: number, notes: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${issueId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffName, progressPercent, notes })
      });
      if (!res.ok) {
        const data = await res.json();
        console.warn('API updateProgress warn:', data.error);
      }
    } catch (e) {
      console.warn('API updateProgress failed:', e);
    }
  },

  // 9. Update Full User Profile in TiDB Database
  async updateUserProfile(userId: string, profileData: Partial<User>): Promise<Partial<User>> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.user || profileData;
      }
    } catch (e) {
      console.warn('API updateUserProfile call failed, using updated local value:', e);
    }
    return profileData;
  }
};
