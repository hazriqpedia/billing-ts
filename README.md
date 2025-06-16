# Billing API

A simple RESTful Billing API built with [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), and PostgreSQL. This project demonstrates modern backend practices including DTO validation, Docker containerization, unit testing, and linting.

---

## 📁 Project Structure

```
src/
├── billing/
│   ├── billing.controller.ts
│   ├── billing.service.ts
│   ├── billing.entity.ts
│   ├── dto/
│   └── ...
├── middleware/
│   └── roles.middleware.ts
├── user/                   <-- (future feature)
│   └── user.entity.ts
├── app.module.ts
├── main.ts
```

---

## Getting Started

### 1. Start in Development Mode

```bash
npm install
npm run start:dev
```

> Uses `.env` for DB config (see `.env.example`)

---

### 2. Start with Docker

```bash
docker build -t billing-api .
docker run -p 3000:3000 --env-file .env billing-api
```

---

### 3. Start with Docker Compose

```bash
docker-compose up --build
```

> Will spin up both the API and PostgreSQL DB

---

## Testing & Quality

### Run Unit Tests

```bash
npm run test
```

### Run Coverage Report

```bash
npm run test:cov
```

> HTML report available in `/coverage/lcov-report/index.html`

### Run Linter

```bash
npm run lint
```

---

### API Endpoints

| Method   | Endpoint   | Description                                | Role Required |
| -------- | ---------- | ------------------------------------------ | ------------- |
| `GET`    | `/billing` | Get all billing records (optional filters) | ❌ No         |
| `POST`   | `/billing` | Create a new billing record                | ✅ admin only |
| `PUT`    | `/billing` | Update a billing record by productCode     | ✅ admin only |
| `DELETE` | `/billing` | Delete a billing record by productCode     | ✅ admin only |

---

### Enabling Admin Role Access

Some endpoints (e.g., POST, PUT, DELETE) require an admin role. This is done via a custom HTTP header:

```
role: admin
```

#### 1. Using Header via Postman / REST Client

```http
POST /billing HTTP/1.1
Host: localhost:3000
Content-Type: application/json
role: admin

{
  "productCode": 4000,
  "location": "West Malaysia",
  "premiumPaid": 521.03
}
```

#### 2. Via Swagger

1. Go to http://localhost:3000/api
2. Click the 🔐 Authorize button (top right)
3. You’ll see a field for role
4. Type: admin and click Authorize

---

## To-Do (Next Features)

- [ ] Add `/users` endpoint and associate billing with users
- [ ] Add pagination and sorting to `/billing`

---

## Example Request Body (POST /billing)

```json
{
  "productCode": 4000,
  "location": "West Malaysia",
  "premiumPaid": 521.03
}
```

---
