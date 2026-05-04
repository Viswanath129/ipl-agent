import type { ApiPayload } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || ''; 

const PUBLIC_API_KEY = 'AIzaSyCPAFtyah0VpLGCmhr87jQLSxO-6A1A0hw';

export const apiClient = {
  async post<T>(endpoint: string, data: ApiPayload): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Key': PUBLIC_API_KEY
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return (await res.json()) as T;
  },

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'X-API-Key': PUBLIC_API_KEY
      }
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return (await res.json()) as T;
  }
};
