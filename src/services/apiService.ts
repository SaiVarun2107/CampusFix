import type { Issue, User } from '../types';

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

  // 2. Fetch all issues from TiDB Cloud
  async getIssues(): Promise<Issue[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues`);
      if (!res.ok) throw new Error('Failed to fetch issues');
      return await res.json();
    } catch (e) {
      console.error('Failed to load issues from backend', e);
      return [];
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

  // 5. Create New Issue (Student)
  async createIssue(issueData: {
    title: string;
    category: string;
    location: { block: string; floor: string; room: string };
    description: string;
    priority: string;
    attachmentUrl?: string;
    reporterId: string;
    reporterName: string;
  }): Promise<Issue> {
    const res = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create issue');
    }
    return data;
  },

  // 6. Staff Request Admin Approval Workflow
  async requestApproval(issueId: string, staffId: string, staffName: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/request-approval`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, staffName })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to request approval');
    }
  },

  // 7. Admin Grant Approval Workflow
  async approveWork(issueId: string, adminName: string, adminComment: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminName, adminComment })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to approve work');
    }
  },

  // 8. Staff Update Progress & Resolution
  async updateProgress(issueId: string, staffName: string, progressPercent: number, notes: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffName, progressPercent, notes })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update progress');
    }
  }
};
