
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sihgyrhzmnxqpkyevtan.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpaGd5cmh6bW54cXBreWV2dGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjM1NDQsImV4cCI6MjA1NjkzOTU0NH0.JPq45oxpyIdV4RxScd79qkhjU0EKc0DSGiRCdm8-FX0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
