import { supabase } from './supabase';

export const fetchAdmins = async () => {
  const { data, error } = await supabase.from('administradores').select('*').eq('activo', true);
  if (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
  return data;
};

export const loginAdmin = async (username, password) => {
  const { data, error } = await supabase
    .from('administradores')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .eq('activo', true)
    .single();
  
  if (error) {
    console.error('Error login admin:', error);
    return null;
  }
  return data;
};

export const createAdmin = async (admin) => {
  const { data, error } = await supabase.from('administradores').insert([admin]).select();
  if (error) {
    console.error('Error creating admin:', error);
    return null;
  }
  return data;
};

export const updateAdmin = async (id, admin) => {
  const { data, error } = await supabase.from('administradores').update(admin).eq('id', id).select();
  if (error) {
    console.error('Error updating admin:', error);
    return null;
  }
  return data;
};

export const deleteAdmin = async (id) => {
  const { error } = await supabase.from('administradores').update({ activo: false }).eq('id', id);
  if (error) {
    console.error('Error deleting admin:', error);
    return false;
  }
  return true;
};

export const logActividad = async (adminId, accion, detalle) => {
  const { error } = await supabase.from('log_actividad').insert([
    { administrador_id: adminId, accion, detalle }
  ]);
  if (error) {
    console.error('Error logging activity:', error);
  }
};
