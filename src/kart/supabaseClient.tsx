import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define the types for your Supabase client
const SUPABASE_URL: string = 'https://glmdosgvqbnejuzyambk.supabase.co';
const SUPABASE_ANON_KEY: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWRvc2d2cWJuZWp1enlhbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTMwMDUsImV4cCI6MjA2NjQyOTAwNX0.Ga7oCIaQMp_AyQkjPczW-qC70Z795S1foGeGNMNtcLM';

// Create the client with inferred type
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
