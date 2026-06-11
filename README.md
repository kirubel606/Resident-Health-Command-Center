# Resident Health Command Center

Built during the Dynamous Agentic Engineering Workshop.

## What It Does
A lightweight clinical dashboard for community health clinics. Staff register patients,
view a prioritized intake queue, and track care plans. AI-assisted triage helps nurses
identify urgent cases without manual review.

## Live Demo
[Link to deployed app or screen recording]

## Tech Stack
- Next.js 15 + React + TypeScript
- Tailwind CSS
- SQL.js (SQLite in-memory)
- Zod runtime validation
- TanStack Query

## How I Used AI (Agentic Workflow)
1. **PRD Review**: AI reviewed the PRD for gaps before any code was written
2. **PIV Loop**: Every feature followed Plan → Implement → Validate
3. **Structured Context**: CLAUDE.md drove consistent AI output across sessions
4. **Feature Flags**: `ai-triage`, `email-reminders`, `care-plan-v2` enabled safe deployment
5. **Custom Skills**: Built reusable `/plan-feature` skill for repeated workflows

## Architecture Decisions
See [ARCHITECTURE.md](./ARCHITECTURE.md) for full decision log.

## Feature Flags
- `ai-triage`: Enables AI-assisted urgency scoring in queue
- `email-reminders`: Shows reminder UI (backend stubbed for future integration)
- `care-plan-v2`: Toggles enhanced care plan interface

## Key Files
- `CLAUDE.md` — Global rules and coding standards
- `PRD.md` — Product requirements
- `ARCHITECTURE.md` — Decision log
- `src/app/` — Next.js app router
- `src/components/` — React components
- `server/src/` — Express API with SQL.js

## Getting Started
```bash
npm install
npm run dev
# App runs at http://localhost:3000
