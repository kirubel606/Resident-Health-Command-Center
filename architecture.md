# Architecture.md

## System Overview

The Resident Health Command Center is a containerized full-stack application for managing patient intake, queue prioritization, and care plan tracking in community clinics.

The system is designed using **Vertical Slice Architecture (VSA)** to ensure each feature is self-contained from API → domain logic → database → UI.

It runs fully locally using Docker Compose and supports reproducible development environments.

Core components:

- Backend API (Node.js + TypeScript + Drizzle + Zod)
- Frontend Dashboard (React + Vite + shadcn/ui)
- Database layer (PostgreSQL or SQLite for MVP)
- Email simulation service (Mailpit)
- Test execution layer (Bun test runner)

---

## Architectural Style: Vertical Slice Architecture

The system is NOT organized by layers (controller/service/repository).

Instead, it is organized by **feature-based vertical slices**.

Each feature contains:

- API routes
- validation schema (Zod)
- business logic
- database access (Drizzle)
- tests (co-located and executable)
- optional UI components (frontend feature code)

### Example Features

- patients
- queue
- care-plans
- triage
- email
- feature-flags

Each feature is fully independent and vertically integrated.

---

## High-Level Architecture

Frontend (React + shadcn/ui)
↓
Backend (Feature-Based Slices)
↓
Database (Drizzle ORM)
↓
Domain Logic (Per-feature implementation)

Side Systems:

- Mailpit (email simulation)
- Feature Flags System
- Bun Test Runner (development + CI)

---

## Services

## 1. Backend Service (api)

Responsibilities:

- Patient lifecycle management
- Queue management and prioritization
- Care plan creation and updates
- Triage computation (rule-based / feature-flag optional)
- Email dispatch (dev via Mailpit)
- Feature flag evaluation

Tech Stack:

- Node.js (Fastify or Express)
- TypeScript
- Drizzle ORM
- Zod validation

Port:

- 3000

---

## 2. Frontend Service (web)

Responsibilities:

- Patient intake UI
- Queue dashboard
- Care plan workflows
- Staff operations interface
- UI composition using shadcn/ui

Tech Stack:

- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

Port:

- 5173

---

## 3. Database Service (db)

MVP:

- SQLite (file-based, mounted volume)

Production-like:

- PostgreSQL

Access Layer:

- Drizzle ORM only

Port (Postgres only):

- 5432

---

## 4. Email Service (mailpit)

Mailpit is used for **development-only email simulation**.

Responsibilities:

- Capture SMTP emails
- Provide email inspection UI
- Simulate real workflows (notifications, reminders)

Ports:

- SMTP: 1025
- Web UI: 8025

---

## 5. Testing System (Bun)

This project uses **Bun test runner** for all testing.

### Purpose

- Validate feature correctness
- Ensure safe refactoring
- Enforce system behavior correctness per feature

### Testing Strategy

Each feature MUST include:

- unit tests (business logic)
- integration tests (API + database interaction)
- feature-level contract tests

### Execution Modes

#### 1. Development Mode
- `bun test --watch`
- continuous test feedback during development

#### 2. CI / Build Mode
- `bun test`
- build fails if any test fails

---

## Runtime Validation (IMPORTANT CLARIFICATION)

The system does NOT execute a full test runner at runtime.

Instead, it supports:

- lightweight startup validation checks
- business invariant checks derived from feature logic

Examples:
- queue sorting sanity check
- triage scoring validation
- critical data integrity checks

These are NOT full tests, but safety validations.

---

## Docker Requirements

The system MUST be fully runnable using:

```bash
docker compose up --build