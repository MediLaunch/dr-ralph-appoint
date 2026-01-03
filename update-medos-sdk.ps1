# Update MedOS SDK Script
# This script copies the latest build of MedOS SDK widgets from the local repository
# to the public folder for development use

Write-Host "Updating MedOS SDK widgets from local build..." -ForegroundColor Cyan

$sdkPath = "..\medos-sdk-js\dist\v1"
$publicPath = ".\public"

# Check if SDK path exists
if (-Not (Test-Path $sdkPath)) {
    Write-Host "Error: MedOS SDK path not found at $sdkPath" -ForegroundColor Red
    Write-Host "Please build the widgets first with:" -ForegroundColor Yellow
    Write-Host "  cd ..\medos-sdk-js" -ForegroundColor Gray
    Write-Host "  npm run build:widgets" -ForegroundColor Gray
    exit 1
}

# Check if widget files exist
if (-Not (Test-Path "$sdkPath\appointments.js")) {
    Write-Host "Error: Widget files not found. Building widgets..." -ForegroundColor Yellow
    Push-Location "..\medos-sdk-js"
    $env:NODE_ENV="production"
    npx rollup -c rollup.widgets.config.js
    Pop-Location
}

# Copy widget files
Write-Host "Copying widget files..." -ForegroundColor Cyan
Copy-Item "$sdkPath\appointments.js" "$publicPath\medos-appointments.js" -Force
Copy-Item "$sdkPath\enquiries.js" "$publicPath\medos-enquiries.js" -Force

Write-Host "✓ Successfully updated MedOS SDK widget files" -ForegroundColor Green
Write-Host "  - medos-appointments.js" -ForegroundColor Gray
Write-Host "  - medos-enquiries.js" -ForegroundColor Gray
Write-Host ""
Write-Host "The widgets are now ready to use. Restart your dev server if needed." -ForegroundColor Cyan
