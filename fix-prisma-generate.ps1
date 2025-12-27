# Script to fix Prisma Client generation on Windows
# Run this script when you get EPERM errors

Write-Host "Stopping Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Cleaning up Prisma temp files..." -ForegroundColor Yellow
$prismaPath = "node_modules\.prisma"
if (Test-Path $prismaPath) {
    Remove-Item -Path "$prismaPath\client\query_engine-windows.dll.node.tmp*" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Remove-Item -Path $prismaPath -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Generating Prisma Client..." -ForegroundColor Green
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Generation failed. Try:" -ForegroundColor Red
    Write-Host "1. Close Cursor/VS Code completely" -ForegroundColor Yellow
    Write-Host "2. Close any running dev servers (npm run dev)" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Write-Host "4. Or restart your computer" -ForegroundColor Yellow
}

