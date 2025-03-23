# Function to check if Docker Engine (daemon) is running via CLI
function Test-DockerEngineRunning {
    try {
        # Use 'docker version' to check if the daemon is responsive
        $result = docker version --format '{{.Server.Version}}' 2>&1
        if ($LASTEXITCODE -eq 0 -and $result) {
            Write-Host "Docker Engine is running. Server version: $result"
            return $true
        } else {
            Write-Host "Docker Engine not responding: $result"
            return $false
        }
    } catch {
        Write-Host "Docker Engine check failed: $_"
        return $false
    }
}

# Function to find Docker Desktop executable path
function Find-DockerDesktopPath {
    Write-Host "Searching for Docker Desktop installation..."

    $possiblePaths = @(
        "${env:ProgramFiles}\Docker\Docker\Docker Desktop.exe",
        "${env:ProgramFiles(x86)}\Docker\Docker\Docker Desktop.exe"
    )

    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Write-Host "Found Docker Desktop at: $path"
            return $path
        }
    }

    try {
        $registryPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"
        $dockerKey = Get-ChildItem $registryPath | 
            Where-Object { $_.GetValue("DisplayName") -like "*Docker Desktop*" }
        
        if ($dockerKey) {
            $installLocation = $dockerKey.GetValue("InstallLocation")
            $exePath = Join-Path $installLocation "Docker Desktop.exe"
            if (Test-Path $exePath) {
                Write-Host "Found Docker Desktop via registry at: $exePath"
                return $exePath
            }
        }
    } catch {
        Write-Host "Warning: Could not search registry for Docker Desktop (may require admin rights)."
    }

    if ($env:DOCKER_DESKTOP_PATH -and (Test-Path $env:DOCKER_DESKTOP_PATH)) {
        Write-Host "Found Docker Desktop via environment variable at: $env:DOCKER_DESKTOP_PATH"
        return $env:DOCKER_DESKTOP_PATH
    }

    Write-Host "Error: Could not locate Docker Desktop executable."
    return $null
}

# Function to start Docker Desktop and wait for the engine to be ready
function Start-DockerEngine {
    $dockerDesktopPath = Find-DockerDesktopPath
    if (-not $dockerDesktopPath) {
        Write-Host "Error: Docker Desktop installation not found."
        Write-Host "Please ensure Docker Desktop is installed and try again."
        return $false
    }
    
    # Check if Docker Desktop process is already running
    $dockerProcess = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
    if (-not $dockerProcess -and -not (Test-DockerEngineRunning)) {
        Write-Host "Docker Engine and Desktop are not running. Starting Docker Desktop at: $dockerDesktopPath..."
        Start-Process -FilePath $dockerDesktopPath -NoNewWindow
    } elseif ($dockerProcess -and -not (Test-DockerEngineRunning)) {
        Write-Host "Docker Desktop process is running, but the engine is not. Waiting for it to start..."
    } else {
        Write-Host "Docker Desktop is already active, checking engine status..."
    }
    
    # Wait for Docker Engine to become available (up to 90 seconds)
    $maxWaitSeconds = 90
    $waitIntervalSeconds = 3
    $elapsed = 0
    
    Write-Host "Waiting for Docker Engine to start..."
    while (-not (Test-DockerEngineRunning) -and $elapsed -lt $maxWaitSeconds) {
        Start-Sleep -Seconds $waitIntervalSeconds
        $elapsed += $waitIntervalSeconds
        Write-Host "Waiting... ($elapsed/$maxWaitSeconds seconds)"
    }
    
    if (Test-DockerEngineRunning) {
        Write-Host "Docker Engine is now running."
        return $true
    } else {
        Write-Host "Error: Docker Engine failed to start within $maxWaitSeconds seconds."
        return $false
    }
}

# Main script logic
Write-Host "Checking if Docker Engine is running..."
$engineRunning = Test-DockerEngineRunning

if ($engineRunning) {
    Write-Host "Docker Engine is confirmed running. Starting docker-compose..."
    docker-compose up
} else {
    # Start Docker Desktop and wait for the engine
    $startedSuccessfully = Start-DockerEngine
    
    if ($startedSuccessfully) {
        Write-Host "Starting docker-compose..."
        docker-compose up
    } else {
        Write-Host "Failed to start Docker Engine automatically."
        Write-Host "Please start Docker Desktop manually, ensure the engine is running (check with 'docker version'), and then run 'docker-compose up' in this directory."
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}