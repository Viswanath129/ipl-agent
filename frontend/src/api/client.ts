import type { ApiPayload } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://ipl-agent-1009309757911.us-central1.run.app'; 

export const apiClient = {
  async post<T>(endpoint: string, data: ApiPayload): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY || ''
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return (await res.json()) as T;
  },

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'X-API-Key': import.meta.env.VITE_API_KEY || ''
      }
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return (await res.json()) as T;
  }
};
