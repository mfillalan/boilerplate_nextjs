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
5. If Docker Engine fails to start or `docker-compose up` errors:
   - Manually open Docker Desktop, wait for it to fully start (check the system tray).
   - Run `docker version` to confirm the server (engine) is active.
   - Then run `powershell -File start-docker.ps1` again.
6. After everything is setup, you can just run the start-project.ps1 file to run the project or use `docker-compose up`

## Setup
1. Install all prerequisite applications.
2. Clone the repository.
3. Make sure Docker Engine is running.
4. Navigate to the folder you cloned the repository to in your choice of terminal.
5. Navigate to the app folder and run the command `npm i`
6. Navigate back to root folder and run the command `docker-compose up`
7. Once the NextJS finishes it should give you a link to access the page.
8. Happy coding :).
