import { supabase } from '../services/supabase';

const BARBERS = [
  {
    nombre: 'Carlos Mendoza',
    especialidad: 'Corte clássico y Barba',
    imagen: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400',
    activo: true
  },
  {
    nombre: 'José Rodríguez',
    especialidad: 'Fade y Diseño',
    imagen: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b15?w=400',
    activo: true
  },
  {
    nombre: 'Marco Fuentes',
    especialidad: 'Corte Moderno y Coloración',
    imagen: 'https://images.unsplash.com/photo-1595152452543-9e1f1d2fb0a5?w=400',
    activo: true
  }
];

async function seedBarbers() {
  console.log('Creando barberos en Supabase...');
  
  for (const barber of BARBERS) {
    const { data, error } = await supabase
      .from('barberos')
      .insert([barber])
      .select();
    
    if (error) {
      console.error(`Error al crear ${barber.nombre}:`, error);
    } else {
      console.log(`✓ ${barber.nombre} creado`);
    }
  }
}

seedBarbers();