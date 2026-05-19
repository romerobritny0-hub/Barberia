$barbers = @(
  @{id=8; nombre="Carlos Mendoza"; especialidad="Corte clásico y Barba"; imagen="https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400"},
  @{id=9; nombre="José Rodríguez"; especialidad="Fade y Diseño"; imagen="https://images.unsplash.com/photo-1585747860715-2ba37e788b15?w=400"},
  @{id=10; nombre="Marco Fuentes"; especialidad="Corte Moderno y Coloración"; imagen="https://images.unsplash.com/photo-1595152452543-9e1f1d2fb0a5?w=400"}
)

foreach ($b in $barbers) {
  $url = "https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/barberos?id=eq.$($b.id)"
  $body = "{`"nombre`":`"$($b.nombre)`",`"especialidad`":`"$($b.especialidad)`",`"imagen`":`"$($b.imagen)`"}"
  Invoke-RestMethod -Uri $url -Method Patch -Header @{
    'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
    'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
    'Content-Type'='application/json'
    'Prefer'='return=minimal'
  } -Body $body
  Write-Host "Updated $($b.nombre)"
}