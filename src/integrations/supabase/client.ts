// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rxhsrdjimgjkypgjgkwi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4aHNyZGppbWdqa3lwZ2pna3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTkxOTcsImV4cCI6MjA2NTkzNTE5N30.MEhWVYOttt8wFP4l0W_F1zo8vxfjq2GkjBJCu1dw7F4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);