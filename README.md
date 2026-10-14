# Institute Management System — Angular Frontend

Beginner-friendly Angular standalone application for the Institute Management System.

## Requirements
- Node.js 24.x recommended (Node 24.21.0 is suitable if installed)
- npm
- Angular CLI 22.x (the npm scripts use the local CLI, installed by `npm install`)
- Spring Boot backend running on `http://localhost:8080`

## Run in VS Code
1. Extract this ZIP.
2. Open the extracted `institute-management-frontend` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Check `node -v` and `npm -v`.
5. Install packages: `npm install`.
6. Start the development server: `npm start`.
7. Open `http://localhost:4200`.

To build: `npm run build`.

## Backend connection
The API base URL is `http://localhost:8080/api` in `src/app/core/api.service.ts`. The app sends HTTP requests with `withCredentials: true` so the browser includes the server-side session cookie. Use `http://localhost:4200` consistently rather than switching between `localhost` and `127.0.0.1`.

## Features
- Home page with student and trainer login cards, registration links, and admin login.
- Student registration and personal dashboard.
- Trainer registration, personal dashboard, and assigned-student list.
- Admin dashboard with student/trainer tables, edit forms, and delete actions.
- Basic form validation and readable error messages.

## Demo admin
Email `admin@institute.local`, password `Admin@12345` (configured in the backend). Change this demo password before using outside a local learning environment.

## Important first-run order
1. Start MySQL.
2. Start the Spring Boot backend.
3. Register at least one trainer.
4. Register students and assign each to a trainer.
5. Log in as student, trainer, or admin.

## Notes
This is an educational starter project. Admin edit forms intentionally keep the existing password if the new password field is blank. Use backend validation and authorization as the source of truth; hiding pages in Angular is not security by itself.
