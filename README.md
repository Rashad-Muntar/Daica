# DAICA

> Demography-Aware Intelligent Claims Assistant — AI-powered motor insurance claims processing platform with fraud detection, multimodal evidence analysis, conversational workflows, and event-driven architecture.

[![Node.js](https://img.shields.io/badge/node-22-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/database-mongodb-green)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/cache-redis-red)](https://redis.io/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

# Overview

DAICA is an AI-powered insurance claims processing platform designed to automate and intelligently assess motor accident claims through:

- Conversational WhatsApp workflows
- Fraud detection & risk scoring
- AI image evidence analysis
- Event-driven claim processing
- Automated decision orchestration

The system demonstrates practical implementation of:

- Software Architecture
- System Design
- AI Engineering
- Event-Driven Systems
- Modular Monolith Architecture
- Observability & Audit Logging

---

# Core Features

- AI-powered vehicle evidence analysis
- WhatsApp-based conversational claim intake
- Fraud scoring engine
- Decision Engine
- Evidence Engine
- Event-driven workflow processing
- Redis-backed session management
- Cloudinary media storage
- Structured audit logging
- Operational observability
- Swagger API documentation
- Scalable modular architecture

---

# Architecture Philosophy

> “The system is implemented as a modular monolith with well-defined domain boundaries. It is intentionally designed for future microservice extraction when scaling requirements increase.”

Why?

Because premature microservices introduce:

- distributed system complexity
- infrastructure overhead
- difficult debugging
- deployment complexity

DAICA optimizes for:

- maintainability
- modularity
- scalability readiness
- clean separation of concerns

---

# High-Level Architecture

```text
WhatsApp User
      ↓
Webhook Layer
      ↓
Conversation Orchestrator
      ↓
Claim Service
      ↓
Event Bus
      ↓
Fraud Engine
      ↓
AI Evidence Analysis
      ↓
Decision Engine v2
      ↓
Final Claim Decision
```

---

# 🛠 Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Session Store | Redis |
| AI Integration | OpenAI-compatible APIs |
| Image Storage | Cloudinary |
| Logging | Pino |
| Validation | Zod |
| API Documentation | Swagger |
| Security | Helmet |
| Rate Limiting | Express Rate Limit |

---

# Project Structure

```text
src/
├── server.ts
├── app.ts
│
├── config/
│
├── integrations/
│   ├── whatssap/
│   └── cloudinary/
│
├── modules/
│   ├── ai/
│   ├── audit/
│   ├── claims/
│   ├── conversation/
│   ├── decision/
│   ├── evidence/
│   ├── events/
│   ├── fraud/
│   ├── observability/
│   └── orchestration/
│
├── middleware/
│
├── infrastructure/
│
└── shared/
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 22+
- MongoDB 6+
- Redis 7+
- Cloudinary Account
- WhatsApp Business API Access

Optional:

- Docker
- Docker Compose

---

# ⚙️ Environment Setup

## 1. Clone Repository

```bash
git clone <repository-url>

cd daica
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create:

```bash
.env
```

Example:

```env
PORT=5000

NODE_ENV=development

API_PREFIX=/api/v1

MONGO_URI=mongodb://localhost:27017/daica

REDIS_URL=redis://localhost:6379

GROQ_API_KEY=your_ai_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

WHATSAPP_VERIFY_TOKEN=your_verify_token
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

---

# Running the Application

## Development Mode

```bash
npm run dev
```

---

## Build Application

```bash
npm run build
```

---

## Start Production Server

```bash
npm run start
```

---

# Docker Setup (Recommended)

## Start Full Environment

```bash
docker compose up
```

---

## Start Detached

```bash
docker compose up -d
```

---

## Stop Services

```bash
docker compose down
```

---

#  Available Scripts

| Command | Description |
|---|---|
| `dev` | Start development server with hot reload |
| `build` | Compile TypeScript |
| `start` | Run production build |
| `lint` | Run ESLint |
| `lint:fix` | Auto-fix lint issues |
| `format` | Format project with Prettier |
| `test` | Run tests |
| `test:watch` | Run tests in watch mode |
| `test:coverage` | Generate coverage report |
| `typecheck` | Run TypeScript type checking |

---

# WhatsApp Integration

DAICA integrates with the WhatsApp Business API to support conversational claim submission.

Features include:

- conversational workflows
- image uploads
- stateful claim sessions
- automated responses

---

## WhatsApp Webhook Endpoint

```text
/api/v1/meta/webhook
```

---

# AI Evidence Analysis

The evidence module supports:

- multiple image reasoning
- vehicle damage assessment
- fraud signal extraction
- structured JSON outputs
- confidence scoring

---

## Example AI Output

```json
{
  "damageDetected": true,
  "damageArea": "FRONT",
  "severity": "MEDIUM",
  "confidence": 91,
  "imagesAnalyzed": 3,
  "visibleIndicators": [
    "front bumper detached",
    "broken headlight"
  ],
  "suspiciousFlags": [],
  "summary": "Visible frontal collision damage detected."
}
```

---

# Event-Driven Workflow

DAICA uses an internal event bus for asynchronous processing.

Example events:

```text
CLAIM_SUBMITTED
FRAUD_ANALYZED
DECISION_GENERATED
AUDIT_LOG_CREATED
```

---

## Workflow Example

```text
Claim Created
      ↓
CLAIM_SUBMITTED Event
      ↓
Fraud Analysis Handler
      ↓
FRAUD_ANALYZED Event
      ↓
Decision Engine
      ↓
DECISION_GENERATED Event
```

---

# Observability & Audit Logs

The system includes:

- structured operational logging
- audit event tracking
- workflow monitoring
- AI response logging
- failure tracing

Implemented using:

- Pino
- Audit Handlers
- Event-driven observability

---

# Security Features

- Helmet security headers
- Rate limiting
- Input validation
- Structured error handling
- Sensitive log redaction
- Request tracing

---

# API Documentation

Swagger UI available at:

```text
http://localhost:5000/api/v1/docs
```

---

# Engineering Concepts Demonstrated

This project intentionally demonstrates practical expertise in:

## Software Architecture

- Modular Monolith
- Event-Driven Architecture
- Dependency Injection
- Composition Root Pattern
- Layered Architecture

---

## AI Engineering

- Multimodal AI pipelines
- Prompt Engineering
- Structured AI outputs
- Evidence parsing
- AI orchestration

---

## Backend Engineering

- Type-safe APIs
- Redis session management
- Repository pattern
- Mongoose ODM design
- Middleware architecture

---

## System Design

- Scalability planning
- Observability
- Fault tolerance
- Workflow orchestration
- Domain-driven boundaries

---

# Future Improvements

Planned future enhancements:

- Kafka / RabbitMQ integration
- OCR for policy extraction
- Human review dashboard
- Vector similarity fraud detection
- Real-time monitoring dashboard
- Multi-insurer support
- Geo-location verification
- AI-powered repair estimation

---

# 👤 Author

**Rashad Muntar**

AI Engineer • Backend Engineer • Software Architect

---

# 📄 License

MIT
