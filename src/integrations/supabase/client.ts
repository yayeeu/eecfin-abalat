// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gtllrruuvhywnbnyding.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0bGxycnV1dmh5d25ibnlkaW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMDI1MDMsImV4cCI6MjA1ODg3ODUwM30.CbWzI4XTthgA9wzEqrSifLgJ1odidhtjitv-OBZxAhM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);