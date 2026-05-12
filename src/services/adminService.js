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
    .eq('activo', true);
  
  if (error || !data || data.length === 0) {
    console.error('Error login admin:', error);
    return null;
  }
  
  const admin = data[0];
  if (admin.password !== password) {
    return null;
  }
  
  return admin;
};

export const createAdmin = async (admin) => {
  const { data, error } = await supabase.from('administradores').insert([admin]).select();
  if (error) throw error;
  return data;
};

export const updateAdmin = async (id, admin) => {
  const { data, error } = await supabase.from('administradores').update(admin).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteAdmin = async (id) => {
  const { error } = await supabase.from('administradores').update({ activo: false }).eq('id', id);
  if (error) throw error;
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
