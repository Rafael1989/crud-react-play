# CRUD React + Play Framework + MySQL

Projeto full stack com:
- Frontend React (layout desktop-first)
- Backend Play Framework com Java
- Banco de dados MySQL

## Estrutura

- `frontend/`: aplicação React (Vite)
- `backend/`: API REST com Play Framework
- `database/`: script de inicialização do banco
- `docker-compose.yml`: sobe o MySQL

## Pré-requisitos

- Java 17 ou 21
- SBT
- Node.js 20+
- Docker + Docker Compose

## 1. Subir o MySQL

```bash
docker compose up -d
```

## 2. Rodar o backend

```bash
cd backend
sbt run
```

API em: `http://localhost:9000`

## 3. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend em: `http://localhost:5173`

## Endpoints principais

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
