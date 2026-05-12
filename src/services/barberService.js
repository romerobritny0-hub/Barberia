import { supabase } from './supabase';

export const fetchBarbers = async () => {
  const { data, error } = await supabase.from('barberos').select('*');
  if (error) {
    console.error('Error fetching barbers:', error);
    return [];
  }
  return data;
};

export const createBarber = async (barber) => {
  const { data, error } = await supabase.from('barberos').insert([barber]);
  if (error) {
    console.error('Error creating barber:', error);
    return null;
  }
  return data;
};

export const updateBarber = async (id, barber) => {
  const { data, error } = await supabase.from('barberos').update(barber).eq('id', id);
  if (error) {
    console.error('Error updating barber:', error);
    return null;
  }
  return data;
};

export const deleteBarber = async (id) => {
  const { error } = await supabase.from('barberos').delete().eq('id', id);
  if (error) {
    console.error('Error deleting barber:', error);
    return false;
  }
  return true;
};
