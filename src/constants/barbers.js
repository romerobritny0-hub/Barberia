export const BARBERS = [
  { id: 1, nombre: 'Carlos Mendoza', especialidad: 'Corte Clásico', imagen: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=500&fit=crop&crop=face' },
  { id: 2, nombre: 'Luis García', especialidad: 'Fade Moderno', imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face' },
  { id: 3, nombre: 'Miguel Torres', especialidad: 'Diseño y Barba', imagen: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face' }
];

export const SCHEDULES = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
});
