# Billing API

A simple RESTful Billing API built with [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), and PostgreSQL. This project demonstrates modern backend practices including DTO validation, Docker containerization, unit testing, and linting.

---

## 📁 Project Structure

```
src/
├── billing/                # Billing module (CRUD for billing records)
│   ├── billing.controller.ts
│   ├── billing.service.ts
│   ├── billing.entity.ts
│   └── dto/
├── user/                   # User module (create/retrieve users)
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.entity.ts
│   └── dto/
├── middleware/             # Custom role guard middleware
├── app.module.ts           # Root module wiring everything
└── main.ts                 # Application bootstrap

```

| Module          | Description                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `UserModule`    | Manages user data such as email, name, and photo. Required before creating billing records.     |
| `BillingModule` | Handles all billing records. Each billing record is **associated with one user** (Many to One). |

Workflows:

- `POST /users` => creates a user.
- `POST /billing?userId=...` => creates a billing record linked to that user.
- `GET /billing` => includes nested user details in the response.

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

- [ ] Add guards to Users Module
- [ ] Add pagination and sorting to `/billing`
- [ ] Search support for user names or billing location

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
