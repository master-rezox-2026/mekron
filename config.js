// Supabase Configuration
// මෙහි ඔබගේ Supabase Project URL සහ Anon Public Key ඇතුළත් කරන්න
const SUPABASE_URL = 'https://kgjkutouneodzngfsozb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KvTVMUSuUnu9s1dgqcsE3w_Q2KcjUiR';

// Initialize Supabase Client (Loaded via CDN in HTML)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
