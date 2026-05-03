const API_BASE = import.meta.env.VITE_API_URL || ''; 

export const apiClient = {
  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_KEY || ''
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  async get(endpoint: string) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY || ''
      }
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  }
};
