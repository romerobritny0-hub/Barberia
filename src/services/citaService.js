import { supabase } from './supabase';

export const fetchCitas = async () => {
  const { data, error } = await supabase
    .from('citas')
    .select('*, barberos(nombre), sillas(numero)')
    .order('fecha', { ascending: false });
  if (error) {
    console.error('Error fetching citas:', error);
    return [];
  }
  return data;
};

export const fetchCitasByDate = async (fecha) => {
  const { data, error } = await supabase
    .from('citas')
    .select('*, barberos(nombre)')
    .eq('fecha', fecha)
    .order('hora');
  if (error) {
    console.error('Error fetching citas:', error);
    return [];
  }
  return data;
};

export const createCita = async (cita) => {
  const { data, error } = await supabase.from('citas').insert([cita]).select();
  if (error) {
    console.error('Error creating cita:', error);
    return null;
  }
  return data;
};

export const updateCita = async (id, cita) => {
  const { data, error } = await supabase.from('citas').update(cita).eq('id', id).select();
  if (error) {
    console.error('Error updating cita:', error);
    return null;
  }
  return data;
};

export const deleteCita = async (id) => {
  const { error } = await supabase.from('citas').delete().eq('id', id);
  if (error) {
    console.error('Error deleting cita:', error);
    return false;
  }
  return true;
};

export const checkSlotAvailable = async (barberoId, fecha, hora) => {
  const { data, error } = await supabase
    .from('citas')
    .select('id')
    .eq('barbero_id', barberoId)
    .eq('fecha', fecha)
    .eq('hora', hora)
    .eq('estado', 'cancelada');
  
  if (error) {
    console.error('Error checking slot:', error);
    return false;
  }
  return data.length === 0;
};
