$headers = @{
  'apikey'='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZXdyanFlemNyaXVkZnlsd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzczODgsImV4cCI6MjA5NDE1MzM4OH0.mzXxLWQVCX313kvGMzxI5vtAL1VrqcjQkCSS5sf3sYw'
  'Content-Type'='application/json'
  'Prefer'='return=representation'
}

# Intentar crear policy de otra forma
$body = '{
  "name": "allow_all_sillas",
  "table_name": "sillas",
  "policy_name": "Allow all access",
  "definition": "true",
  "check": "true"
}'

try {
  $result = Invoke-RestMethod -Uri 'https://hoewrjqezcriudfylwdm.supabase.co/storage/v1/policies' -Method Post -Header $headers -Body $body
  Write-Host "Success"
} catch {
  Write-Host "Error: $_"
}