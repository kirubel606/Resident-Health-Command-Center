# Resident Health Command Center

A lightweight, AI-powered clinical dashboard for community health clinics, designed for efficient patient intake, triage, and care tracking.

## Key Capabilities
- **AI-Assisted Patient Triage**: Automatically assigns urgency scores (1-10) to incoming patients based on symptom analysis using local Ollama models (default `llama3.1:8b`).
- **Automated Email Reminders**: Seamless patient appointment reminders integrated via Nodemailer (with Mailpit support for local development).
- **Prioritized Queue Management**: Dynamic intake queue with real-time searching, status filtering, and AI-suggested urgency ranking.
- **Clinical Care Planning**: Integrated care plan generation and management directly from the dashboard.
- **Analytics Dashboard**: Visual overview of patient flow and triage distribution.
- **Robust Feature Gating**: Fine-grained control over AI and email features via runtime environment variables.

## Tech Stack
- **Framework**: Next.js 15 + React + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Drizzle ORM)
- **AI/ML**: Local Ollama (e.g., `llama3.1:8b`)
- **Backend/API**: Next.js API Routes (App Router)
- **Utilities**: Zod (validation), Nodemailer (email), Pino (structured logging)

## Agentic Implementation
- **Plan → Act → Validate**: Every feature implemented through a rigorous agentic loop with automated verification.
- **Local AI Triage**: Clinical reasoning performed locally, ensuring patient data privacy.
- **Feature Flags**: Safely gated capabilities (`aiTriage`, `emailReminders`) to ensure system stability.

## Getting Started
Ensure you have Docker running (for PostgreSQL and Mailpit) and Ollama installed.

1. **Environment Setup**: Copy `.env.example` to `.env` and fill in necessary configuration.
2. **Install**: `bun install`
3. **Database**: `docker compose up -d`
4. **Develop**: `bun run dev`
# App runs at http://localhost:3000
