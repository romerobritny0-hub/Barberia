import { supabase } from './supabase';

export const uploadBarberImage = async (uri, barberName) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const fileName = `${barberName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    const filePath = `barbers/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('barbers')
      .upload(filePath, blob, { contentType: 'image/jpeg' });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from('barbers').getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};