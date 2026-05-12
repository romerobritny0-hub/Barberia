import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hoewrjqezcriudfylwdm.supabase.co';
const supabaseAnonKey = 'sb_publishable_KegFhb2mPI3vWGQ2AeQ25Q_52QsGrUP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
