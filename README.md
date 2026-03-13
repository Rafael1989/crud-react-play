# CRUD React + Play Framework + MySQL

Full-stack product CRUD project with a React frontend and a Play Framework (Java) REST API backed by MySQL.

## Stack

- Frontend: React + Vite
- Backend: Play Framework 2.9 (Java)
- Database: MySQL 8

## Project Structure

- frontend/: React application
- backend/: Play REST API
- database/: SQL scripts
- docker-compose.yml: MySQL container
- start-backend.bat: starts backend on Windows
- start-frontend.bat: starts frontend on Windows
- stop-play.bat: stops Play/Java/SBT processes and frees ports

## Prerequisites

- Java 17 or 21 (recommended)
- Node.js 20+
- npm
- SBT
- MySQL 8 local install or Docker

## Database Configuration

This project is configured with:

- host: localhost
- port: 3306
- database: crud_play
- username: root
- password: root

Credentials are defined in backend/conf/application.conf.

### Option A: MySQL with Docker

```bash
docker compose up -d
```

### Option B: Local MySQL

Create the database and products table using the SQL script in database/.

## Running the Project (Manual)

### 1) Backend

```bash
cd backend
sbt run
```

Backend URL: http://localhost:9000

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

If port 5173 is busy, Vite will use another port (for example, 5174).

## Running the Project (Windows Scripts)

From the project root:

```bat
start-backend.bat
start-frontend.bat
```

To stop services and free Play ports:

```bat
stop-play.bat
```

## API Endpoints

- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

## Payload Example

```json
{
  "name": "Mechanical Keyboard",
  "description": "RGB",
  "price": 350.0,
  "quantity": 15
}
```

## Troubleshooting

### SBT Error on Windows (ServerAlreadyBootingException / lock)

If you see a lock error like sbt-load-..._lock:

1. Run stop-play.bat
2. Open a new terminal
3. Go to backend/
4. Run sbt run again

### Java 25 Warning

Play 2.9 officially supports Java 11, 17, and 21. Java 25 may still run, but with warnings and possible instability.

## CRUD Goals

- Create product
- List products
- Update product
- Delete product
