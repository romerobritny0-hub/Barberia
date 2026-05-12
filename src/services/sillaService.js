import { supabase } from './supabase';

export const fetchSillas = async () => {
  const { data, error } = await supabase.from('sillas').select('*').order('numero');
  if (error) {
    console.error('Error fetching sillas:', error);
    return [];
  }
  return data;
};

export const createSilla = async (silla) => {
  const { data, error } = await supabase.from('sillas').insert([silla]).select();
  if (error) {
    console.error('Error creating silla:', error);
    return null;
  }
  return data;
};

export const updateSilla = async (id, silla) => {
  const { data, error } = await supabase.from('sillas').update(silla).eq('id', id).select();
  if (error) {
    console.error('Error updating silla:', error);
    return null;
  }
  return data;
};

export const deleteSilla = async (id) => {
  const { error } = await supabase.from('sillas').delete().eq('id', id);
  if (error) {
    console.error('Error deleting silla:', error);
    return false;
  }
  return true;
};
