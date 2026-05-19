$body = '[{"nombre": "Carlos Mendoza", "especialidad": "Corte clásico y Barba", "imagen": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400", "activo": true}, {"nombre": "José Rodríguez", "especialidad": "Fade y Diseño", "imagen": "https://images.unsplash.com/photo-1585747860715-2ba37e788b15?w=400", "activo": true}, {"nombre": "Marco Fuentes", "especialidad": "Corte Moderno y Coloración", "imagen": "https://images.unsplash.com/photo-1595152452543-9e1f1d2fb0a5?w=400", "activo": true}]'

Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/barberos' -Method Post -Header @{
  'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Content-Type'='application/json'
  'Prefer'='return=minimal'
} -Body $body