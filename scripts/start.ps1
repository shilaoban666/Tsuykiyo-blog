param(
  [switch]$Rebuild,
  [switch]$Dev
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$env:npm_config_cache = Join-Path $root ".npm-cache"
$env:NEXT_TELEMETRY_DISABLED = "1"

function Write-Step($text) {
  Write-Host ""
  Write-Host "  $text" -ForegroundColor Cyan
}

function Invoke-Checked($file, $arguments) {
  & $file @arguments
  if ($LASTEXITCODE -ne 0) {
    throw "命令执行失败：$file $($arguments -join ' ')"
  }
}

Write-Host ""
Write-Host "  ==============================================" -ForegroundColor DarkGray
Write-Host "   月白 TSUKIYO  ·  一键启动" -ForegroundColor White
Write-Host "   Blog + CMS  ·  Next.js + PostgreSQL" -ForegroundColor DarkGray
Write-Host "  ==============================================" -ForegroundColor DarkGray

Write-Step "检查 Node.js…"
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  throw "没有找到 Node.js。请先安装 Node.js 20.9 或以上版本：https://nodejs.org/"
}
$version = (& node -v).TrimStart("v")
$major = [int]($version.Split(".")[0])
if ($major -lt 20) {
  throw "Node.js 版本过低（$version），需要 20.9 或以上。"
}
Write-Host "  ✓ Node.js $version" -ForegroundColor Green

Write-Step "准备环境变量与数据目录…"
Invoke-Checked "node" @("scripts/bootstrap.mjs")

if (-not (Test-Path (Join-Path $root "node_modules"))) {
  Write-Step "首次运行，安装依赖（可能需要几分钟）…"
  Invoke-Checked "npm.cmd" @("install", "--no-audit", "--no-fund")
} else {
  Write-Host "  ✓ 依赖已安装" -ForegroundColor Green
}

Write-Step "检查 PostgreSQL…"
$service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($service -and $service.Status -ne "Running") {
  Write-Host "  尝试启动 PostgreSQL 服务 $($service.Name)…" -ForegroundColor Yellow
  try {
    Start-Service $service.Name
    Start-Sleep -Seconds 2
  } catch {
    Write-Host "  ! 无法自动启动服务，请手动启动 PostgreSQL 后重试。" -ForegroundColor Yellow
  }
}
if ($service) {
  Write-Host "  ✓ 服务 $($service.Name) 状态：$((Get-Service $service.Name).Status)" -ForegroundColor Green
} else {
  Write-Host "  ! 未发现 Windows PostgreSQL 服务，将直接尝试连接 DATABASE_URL。" -ForegroundColor Yellow
}

Write-Step "初始化数据库与示例内容…"
Invoke-Checked "node" @("scripts/setup-db.mjs")
Invoke-Checked "node" @("scripts/seed.mjs")

if ($Dev) {
  Write-Step "启动开发服务器 http://localhost:3000 …"
  Start-Process "http://localhost:3000"
  Invoke-Checked "npm.cmd" @("run", "dev")
  exit 0
}

if ($Rebuild -or -not (Test-Path (Join-Path $root ".next\BUILD_ID"))) {
  Write-Step "构建生产版本（首次约 1-2 分钟）…"
  Invoke-Checked "npm.cmd" @("run", "build")
} else {
  Write-Host "  ✓ 已有生产构建（需要重建请运行 start.bat -Rebuild）" -ForegroundColor Green
}

Write-Step "启动站点…"
Write-Host "  前台  http://localhost:3000" -ForegroundColor White
Write-Host "  后台  http://localhost:3000/admin" -ForegroundColor White
Write-Host "  按 Ctrl+C 停止服务" -ForegroundColor DarkGray

Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Hidden", "-Command", "Start-Sleep -Seconds 6; Start-Process 'http://localhost:3000'"
Invoke-Checked "npm.cmd" @("run", "start")