# NextJS + PostgresSQL Project Boilerplate

This is a boilerplate project using: 
- [NextJS](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/) for the front-end and API 
- [Shadcn](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/) for the UI library
- [PostgreSQL](https://www.postgresql.org/) as the database 
- [Prisma](https://www.prisma.io/) as the ORM 
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for the development environment

## Prerequisites
- [Docker](https://www.docker.com/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.
- [NodeJS](https://nodejs.org/) installed.
- [Git](https://git-scm.com/) installed.

## Setup for Windows
1. Open PowerShell as Administrator.
2. Navigate to the project directory: `cd path\to\your\repo`
3. Run the setup script: `powershell -File setup.ps1`
   - This will install or update Chocolatey, set up Node.js, Git, and Docker Desktop.
   - A new PowerShell window will open to start Docker Desktop (if needed) and run `docker-compose up`.
4. Restart your system if prompted (required after Docker install).
5. If Docker fails to start automatically, ensure it’s installed and set the environment variable `DOCKER_DESKTOP_PATH` to its executable location (e.g., `setx DOCKER_DESKTOP_PATH "C:\Path\To\Docker Desktop.exe"`), then run `powershell -File start-docker.ps1` again.
6. After everything is setup, you can just run the start-project.ps1 file to run the project or use `docker-compose up`

## Setup
1. Installed all prerequisite applications.
2. Clone the repository.
3. Make sure Docker Engine is running.
4. Navigate to the folder you cloned the repository in your choise of terminal.
5. Run the command `docker-compose up`
6. Once the NextJS finishes it should give you a link to access the page.