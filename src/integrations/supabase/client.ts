
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rmsvbsiowzgjisxbbjic.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtc3Zic2lvd3pnamlzeGJiamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDUxMzcsImV4cCI6MjA1NjgyMTEzN30.kflff7QtIqxyZoUdZI3T0LMuYc6okfRJr_d_z4gJ0AE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
