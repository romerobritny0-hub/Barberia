$headers = @{
  'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Content-Type'='application/json'
  'Prefer'='return=representation'
}

$body = '{
  "name": "Permitir todo en sillas",
  "schema": "public",
  "table": "sillas",
  " permissive": true,
  "roles": ["anon", "authenticated"],
  "command": "ALL",
  "with_check": "true"
}'

try {
  $result = Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/rest/v1/policies' -Method Post -Header $headers -Body $body
  Write-Host "Policy created"
  $result
} catch {
  Write-Host "Error: $_"
}