import { supabase } from './supabase';

export const fetchBarbers = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  
  try {
    const { data, error } = await supabase
      .from('barberos')
      .select('*')
      .eq('activo', true)
      .abortSignal(controller.signal);
    
    clearTimeout(timeout);
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    clearTimeout(timeout);
    console.error('Fetch error:', e);
    return [];
  }
};

export const createBarber = async (barber) => {
  const { data, error } = await supabase.from('barberos').insert([barber]).select();
  if (error) throw error;
  return data;
};

export const updateBarber = async (id, barber) => {
  const { data, error } = await supabase.from('barberos').update(barber).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteBarber = async (id) => {
  const { error } = await supabase.from('barberos').delete().eq('id', id);
  if (error) throw error;
  return true;
};
