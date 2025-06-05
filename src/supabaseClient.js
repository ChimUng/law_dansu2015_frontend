import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsjonbzvqxlococgexmg.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam9uYnp2cXhsb2NvY2dleG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzM5OTMsImV4cCI6MjA2MjEwOTk5M30.TteJS6KpUI_A4eZAWQaWzbypyEUJ19Pt8qtDPknGbp8'; 

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});