import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get auth headers for API calls
export function getAuthHeaders(session) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
    };
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
