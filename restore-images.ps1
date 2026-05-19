$headers = @{
  'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Content-Type'='application/json'
  'Prefer'='return=minimal'
}

# Carlos Mendoza (id 8)
Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/barberos?id=eq.8' -Method Patch -Header $headers -Body '{"imagen":"https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400"}'

# José Rodríguez (id 9)  
Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/barberos?id=eq.9' -Method Patch -Header $headers -Body '{"imagen":"https://images.unsplash.com/photo-1585747860715-2ba37e788b15?w=400"}'

# Marco Fuentes (id 10)
Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/barberos?id=eq.10' -Method Patch -Header $headers -Body '{"imagen":"https://images.unsplash.com/photo-1595152452543-9e1f1d2fb0a5?w=400"}'

Write-Host "Barberos actualizados"