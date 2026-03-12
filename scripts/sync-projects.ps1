$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$jsonPath = Join-Path $root "data/projects.json"
$jsPath = Join-Path $root "data/projects.js"

if (!(Test-Path $jsonPath)) {
  throw "Missing source file: $jsonPath"
}

# Validate JSON before writing JS output.
$projects = Get-Content $jsonPath -Raw | ConvertFrom-Json
$json = $projects | ConvertTo-Json -Depth 100

$output = "window.PORTFOLIO_PROJECTS = $json;"
Set-Content -Path $jsPath -Value $output -Encoding utf8

Write-Host "Synced data/projects.js from data/projects.json"
