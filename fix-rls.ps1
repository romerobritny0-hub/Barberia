$headers = @{
  'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Content-Type'='application/json'
}

# Desactivar RLS en sillas
Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/pg_catalog/pg_tables' -Method Get -Header $headers