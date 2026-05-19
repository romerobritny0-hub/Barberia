import { supabase } from './supabase';

export const fetchSillas = async () => {
  try {
    console.log('Cargando sillas...');

    const { data, error } = await supabase
      .from('sillas')
      .select('*')
      .order('numero', { ascending: true });

    if (error) {
      console.log('ERROR FETCH SILLAS:', error);
      return [];
    }

    console.log('Sillas cargadas:', data);
    return data || [];

  } catch (e) {
    console.log('ERROR GENERAL FETCH:', e);
    return [];
  }
};

export const createSilla = async (silla) => {
  try {
    const { data, error } = await supabase
      .from('sillas')
      .insert([
        {
          numero: Number(silla.numero),
          ubicacion: String(silla.ubicacion),
          estado: ['disponible', 'ocupada', 'mantenimiento'].includes(silla.estado)
            ? silla.estado
            : 'disponible',
        }
      ])
      .select();

    if (error) {
      console.log('ERROR CREATE:', error);
      throw error;
    }

    return data;

  } catch (e) {
    console.log('ERROR GENERAL CREATE:', e);
    throw e;
  }
};

export const updateSilla = async (id, silla) => {
  const { data, error } = await supabase
    .from('sillas')
    .update(silla)
    .eq('id', id)
    .select();

  if (error) throw error;

  return data;
};

export const deleteSilla = async (id) => {
  const { error } = await supabase
    .from('sillas')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return true;
};