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
Write-Host "Setup complete! Starting Docker check..."

# Launch a new PowerShell window to run start-docker.ps1
Start-Process powershell -ArgumentList "-File start-project.ps1"