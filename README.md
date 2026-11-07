# Healthcare Management System (MERN)

Modern starter project for a role-based healthcare management system.

## Stack
- Frontend: React + Vite + Tailwind CSS v4 + React Router + Axios + Lucide
- Backend: Node.js + Express
- Database: MongoDB / MongoDB Atlas
- Authentication: JWT + bcrypt

## Requirements
- Node.js 20+
- MongoDB Atlas account or local MongoDB

## 1. Backend setup
```bash
cd server
npm install
```
Create `server/.env` from `.env.example`, then set your MongoDB URI and JWT secret.

```bash
npm run dev
```
Backend runs at http://localhost:5000

## 2. Frontend setup
Open another terminal:
```bash
cd client
npm install
npm run dev
```
Frontend runs at the URL shown by Vite (usually http://localhost:5173).

## Demo flow
- Open Register and create an account with one of these roles: patient, doctor, hospital, admin.
- Sign in to see the role-aware dashboard.
- The current version includes starter authentication and dashboard UI. Patient appointments, prescriptions, reports, doctor/hospital management, chat, and other domain modules can be added incrementally.

## Important
This is a development starter, not a production-ready medical records system. Before real use, add validation, audit logs, access-control tests, rate limiting, secure deployment settings, backups, and privacy/compliance review. Do not enter real patient data.
