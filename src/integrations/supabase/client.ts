// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hgzetexorbikseqroxnw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnemV0ZXhvcmJpa3NlcXJveG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTU1NjYsImV4cCI6MjA1NDg3MTU2Nn0._0yTCGyTjtPcCGe-H6nVyDKaFXjSgT-la4Ni2rine74";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);