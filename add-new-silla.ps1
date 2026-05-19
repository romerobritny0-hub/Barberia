$headers = @{
  'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Content-Type'='application/json'
}

# Agregar silla nueva (prueba)
Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/sillas' -Method Post -Header $headers -Body '{"numero":6,"ubicacion":"Nueva Ubicacion","estado":"disponible"}'

Write-Host "Silla creada"