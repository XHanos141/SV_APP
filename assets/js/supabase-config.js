// Shared Supabase connection for SuppVerse BD Admin pages.
// Loaded by both admin_login.html and admin_profile.html.
// This only carries the public, safe-to-expose keys — real access control
// happens inside the database itself (Row Level Security), not here.

const SB_URL = 'https://tlkoxltugvfwxmnrthvr.supabase.co';
const SB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsa294bHR1Z3Zmd3htbnJ0aHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwOTIxNTIsImV4cCI6MjEwMzY2ODE1Mn0.UMFWCIPoNJn5kAX5v9OXVkH3wmxp_dtDG7dgNQ3BK7E';

window.sb = window.supabase.createClient(SB_URL, SB_ANON_KEY, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true
  }
});

// Signal other scripts on the page once Supabase has fully finished
// reading any login token from the URL and cleaning it up. Other
// startup code should wait on window.__sbReady before assuming the
// user's session/URL state is stable, instead of racing this process.
window.__sbReady = window.sb.auth.getSession().then(function(){
  // Strip a leftover #access_token=... fragment from the address bar
  // once Supabase has consumed it, so nothing later mistakes it for
  // page state and no sensitive token stays visible in the URL.
  if (window.location.hash && window.location.hash.indexOf('access_token') !== -1) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  return true;
}).catch(function(){ return true; });
