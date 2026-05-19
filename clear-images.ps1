$ids = @(8, 9, 10)

foreach ($id in $ids) {
  try {
    $url = "https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/barberos?id=eq.$id"
    Invoke-RestMethod -Uri $url -Method Patch -Header @{
      'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
      'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
      'Content-Type'='application/json'
      'Prefer'='return=minimal'
    } -Body '{"imagen":""}'
    Write-Host "Updated barber $id"
  } catch {
    Write-Host "Error updating $id : $_"
  }
}