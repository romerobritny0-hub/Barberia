import { supabase } from './supabase';

export const fetchSillas = async () => {
  try {
    const { data, error } = await supabase.from('sillas').select('*').order('numero');
    if (error) {
      console.error('Error fetching sillas:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Fetch error:', e);
    return [];
  }
};

export const createSilla = async (silla) => {
  const { data, error } = await supabase.from('sillas').insert([silla]).select();
  if (error) throw error;
  return data;
};

export const updateSilla = async (id, silla) => {
  const { data, error } = await supabase.from('sillas').update(silla).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteSilla = async (id) => {
  const { error } = await supabase.from('sillas').delete().eq('id', id);
  if (error) throw error;
  return true;
};
