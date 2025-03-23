# Check and install/update Chocolatey
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey not found. Installing Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope CurrentUser -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey found. Updating to latest version..."
    choco upgrade chocolatey -y
}

# Install Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Node.js..."
    choco install nodejs-lts -y
} else {
    Write-Host "Node.js already installed."
}

# Install Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Git..."
    choco install git -y
} else {
    Write-Host "Git already installed."
}

# Install Docker Desktop
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Docker Desktop..."
    choco install docker-desktop -y
    Write-Host "Please restart your system after Docker installation."
} else {
    Write-Host "Docker Desktop already installed."
}

# Verify installations
Write-Host "Verifying installations..."
node -v
git --version
docker --version
Write-Host "Setup complete! Installing project dependencies..."

# Change to the app directory and run npm i
$appDir = Join-Path $PSScriptRoot "app"
if (Test-Path $appDir) {
    Write-Host "Navigating to app directory: $appDir"
    Set-Location $appDir
    Write-Host "Running 'npm i' to install dependencies..."
    # Run npm install synchronously using Invoke-Expression and wait for completion
    try {
        Invoke-Expression "npm i" -ErrorAction Stop
        Write-Host "npm install completed successfully."
    } catch {
        Write-Host "Error: npm install failed: $_"
        Write-Host "Please check the app directory for a valid package.json and try running 'npm i' manually."
        exit 1
    }
} else {
    Write-Host "Error: 'app' directory not found in $PSScriptRoot."
    Write-Host "Please ensure the 'app' folder exists in the root directory."
    exit 1
}

# Launch a new PowerShell window to run start-project.ps1 from the root directory
Write-Host "Starting project in a new PowerShell window..."
Start-Process powershell -ArgumentList "-File `"$PSScriptRoot\start-project.ps1`""