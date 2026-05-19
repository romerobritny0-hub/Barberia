import { Platform } from 'react-native';
import { supabase } from './supabase';

export const uploadBarberImage = async (uri, barberName) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    let blob;
    
    if (uri.startsWith('data:')) {
      const base64Response = await fetch(uri, { signal: controller.signal });
      blob = await base64Response.blob();
    } else if (Platform.OS === 'web' || uri.startsWith('blob:')) {
      const response = await fetch(uri, { signal: controller.signal });
      blob = await response.blob();
    } else {
      blob = null;
    }
    
    clearTimeout(timeout);
    
    if (!blob) return null;
    
    const fileName = `${barberName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    const filePath = `barbers/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('barbers')
      .upload(filePath, blob, { contentType: 'image/jpeg' });
    
    if (error) {
      return null;
    }
    
    const { data: urlData } = supabase.storage.from('barbers').getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (error) {
    return null;
  }
};