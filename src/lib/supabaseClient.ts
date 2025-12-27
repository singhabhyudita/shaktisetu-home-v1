import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase configuration missing!");
  console.log("REACT_APP_SUPABASE_URL:", supabaseUrl ? "Found" : "Missing");
  console.log(
    "REACT_APP_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "Found" : "Missing",
  );
}

// Create client even if missing, it will fail gracefully on use or createClient might fail
// If createClient throws on empty strings, we might need a dummy URL
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
