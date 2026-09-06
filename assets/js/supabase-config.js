// Shared Supabase connection for SuppVerse BD Admin pages.
// Loaded by both admin_login.html and admin_profile.html.
// This only carries the public, safe-to-expose keys — real access control
// happens inside the database itself (Row Level Security), not here.

const SB_URL = 'https://tlkoxltugvfwxmnrthvr.supabase.co';
const SB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsa294bHR1Z3Zmd3htbnJ0aHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwOTIxNTIsImV4cCI6MjEwMzY2ODE1Mn0.UMFWCIPoNJn5kAX5v9OXVkH3wmxp_dtDG7dgNQ3BK7E';

window.sb = window.supabase.createClient(SB_URL, SB_ANON_KEY);
