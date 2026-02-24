# Nest + React Technical Test

Panduan lengkap untuk menjalankan dan mengintegrasikan Frontend (React + Vite) dan Backend (NestJS) applications.

## Daftar Isi
- [Prasyarat](#prasyarat)
- [Setup Backend](#setup-backend)
- [Setup Frontend](#setup-frontend)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Integrasi Frontend-Backend](#integrasi-frontend-backend)
- [API Endpoints](#api-endpoints)

---

## ✅ Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (v18+): https://nodejs.org/
- **Yarn** atau **npm**: Package manager untuk Node.js
- **Git**: Untuk version control
- **MySQL** (opsional): Jika backend menggunakan database

Verifikasi instalasi:
```bash
node --version
npm --version
# atau jika menggunakan yarn
yarn --version
```

---

## 🚀 Setup Backend (NestJS)

### 1. Navigasi ke direktori backend
```bash
cd nest_technical_test
```

### 2. Install dependencies
```bash
yarn install
# atau
npm install
```

### 3. Setup environment variables (jika diperlukan)
Buat file `.env` di root folder `nest_technical_test/`:
```bash
# Database Configuration (jika menggunakan database)
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# Server Configuration
PORT=
NODE_ENV=development
```

### 4. Setup Database (jika diperlukan)
Jika backend menggunakan TypeORM dengan MySQL:
```bash
# Jalankan migrations
yarn typeorm migration:run
# atau
npm run typeorm migration:run
```

### 5. Verifikasi backend berjalan
```bash
# Mode development (dengan auto-reload)
yarn start:dev
# atau
npm run start:dev

# Mode production
yarn start:prod
# atau
npm run start:prod
```

Backend akan berjalan di: **http://localhost:3000**

---

## 🎨 Setup Frontend (React + Vite)

### 1. Navigasi ke direktori frontend
```bash
cd FE-technical-test
```

### 2. Install dependencies
```bash
yarn install
# atau
npm install
```

### 3. Setup environment variables (jika diperlukan)
Buat file `.env` di root folder `FE-technical-test/`:
```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
```

### 4. Verifikasi frontend berjalan
```bash
# Mode development (dengan hot-reload)
yarn dev
# atau
npm run dev

# Build untuk production
yarn build
# atau
npm run build

# Preview production build
yarn preview
# atau
npm run preview
```

Frontend akan berjalan di: **http://localhost:5173** (default Vite)

---

## 🔄 Menjalankan Aplikasi (Full Stack)

### Opsi 1: Menjalankan di Terminal Terpisah (Recommended)

**Terminal 1 - Backend:**
```bash
cd nest_technical_test
yarn start:dev
```

**Terminal 2 - Frontend:**
```bash
cd FE-technical-test
yarn dev
```

Buka browser: **http://localhost:5173**
Backend API tersedia di: **http://localhost:3000**

### Opsi 2: Menjalankan dengan npm-run-all (Concurrent)

Install npm-run-all secara global:
```bash
npm install -g npm-run-all
```

Di root directory, buat `package.json`:
```json
{
  "name": "nest-react-fullstack",
  "scripts": {
    "dev": "npm-run-all -p dev:backend dev:frontend",
    "dev:backend": "cd nest_technical_test && npm run start:dev",
    "dev:frontend": "cd FE-technical-test && npm run dev"
  }
}
```

Jalankan:
```bash
npm run dev
```

---

## 🔗 Integrasi Frontend-Backend

### 1. Konfigurasi API Client (Frontend)

Di `FE-technical-test/src/`, buat file `api/client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Menggunakan API Client di Components

Contoh penggunaan di React component:

```typescript
import { useEffect, useState } from 'react';
import apiClient from '../api/client';

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await apiClient.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 3. CORS Configuration (Backend)

Di `nest_technical_test/src/main.ts`, enable CORS:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS untuk frontend
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Production
    ],
    credentials: true,
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
```

---

## 📡 API Endpoints

### Todos Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/todos` | Dapatkan semua todos |
| GET | `/todos/:id` | Dapatkan todo berdasarkan ID |
| POST | `/todos` | Buat todo baru |
| PATCH | `/todos/:id` | Update todo |
| DELETE | `/todos/:id` | Hapus todo |

#### Contoh Request

**GET - Dapatkan Semua Todos**
```bash
curl http://localhost:3000/todos
```

**POST - Buat Todo Baru**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn NestJS", "description": "Study NestJS framework"}'
```

**PATCH - Update Todo**
```bash
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "isCompleted": true}'
```

---

## 📝 Useful Commands

### Backend Commands
```bash
# Development mode dengan auto-reload
yarn start:dev

# Production build dan run
yarn build
yarn start:prod

# Linting
yarn lint

# Testing
yarn test
yarn test:watch
yarn test:cov

# End-to-End Testing
yarn test:e2e
```

### Frontend Commands
```bash
# Development mode dengan hot-reload
yarn dev

# Build untuk production
yarn build

# Preview production build
yarn preview

# Linting
yarn lint
```

---

## 🐛 Troubleshooting

### Issue: Frontend tidak bisa terhubung ke Backend
**Solution:**
- Pastikan backend berjalan di `http://localhost:3000`
- Check CORS configuration di backend
- Verify `VITE_API_BASE_URL` di `.env` frontend

### Issue: Port sudah digunakan
**Solution:**
```bash
# Ganti port backend (di main.ts)
await app.listen(3000) atau buat PORT pada .env;

# Ganti port frontend (di vite.config.ts)
export default defineConfig({
  server: {
    port: 5174 // Ganti ke port lain
  }
});
```

### Issue: Database connection error
**Solution:**
- Pastikan MySQL running
- Check database credentials di `.env`
- Verify database name dan user permissions

### Issue: Module not found errors
**Solution:**
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
yarn install
```

---

## 📂 Project Structure

```
Nest + React/
├── nest_technical_test/          # Backend NestJS
│   ├── src/
│   │   ├── main.ts              # Entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── app.controller.ts    # Controllers
│   │   ├── app.service.ts       # Services
│   │   └── todos/               # Todos module
│   ├── test/                    # E2E tests
│   ├── package.json
│   └── tsconfig.json
│
├── FE-technical-test/            # Frontend React + Vite
│   ├── src/
│   │   ├── main.tsx             # Entry point
│   │   ├── App.tsx              # Root component
│   │   ├── components/          # React components
│   │   └── api/                 # API client
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md                     # This file
```

---
