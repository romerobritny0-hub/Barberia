$headers = @{
  'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Content-Type'='application/json'
}

# Agregar varias sillas
$sillas = @(
  '{"numero":1,"ubicacion":"Entrada","estado":"disponible"}',
  '{"numero":2,"ubicacion":"Centro","estado":"disponible"}',
  '{"numero":3,"ubicacion":"Fondo","estado":"disponible"}',
  '{"numero":4,"ubicacion":"VIP","estado":"disponible"}'
)

foreach ($silla in $sillas) {
  try {
    Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/sillas' -Method Post -Header $headers -Body $silla
    Write-Host "Created: $silla"
  } catch {
    Write-Host "Skipped (probably exists)"
  }
}