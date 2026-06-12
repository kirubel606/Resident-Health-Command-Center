
# Resident Health Command Center

## Problem Statement

Community health clinics need a simple, fast system to manage patient intake, prioritize urgent cases, and track care plans. Existing hospital-grade systems are too complex, expensive, and slow for low-resource or high-throughput environments. Staff need a lightweight tool that supports rapid registration, queue management, and basic clinical tracking without requiring training-heavy enterprise software.

---

## Key Hypothesis

We believe a lightweight clinical command dashboard will improve patient throughput and prioritization accuracy in community clinics.

We’ll know we’re right when:

* Patients can be registered in under 30 seconds
* Queue updates reflect in under 1 second
* Staff can identify urgent cases without manual review of all records

---

## Users

**Primary Users**

* Front desk staff: register patients and manage intake flow
* Nurses: monitor queue, update care plans, handle prioritization

**Job to Be Done**

When a patient arrives at the clinic, staff need to quickly register them, determine urgency, and assign them into a prioritized queue so care can be delivered efficiently without delays or confusion.

**Non-Users**

* Patients (they do not interact directly with the system)
* External hospital systems (out of scope)

---

## Solution

A lightweight full-stack clinical operations dashboard that includes:

* Patient registration system
* Real-time appointment / intake queue
* Care plan tracking module
* Rule-based + optional AI-assisted triage system (feature-flag controlled)

---

## MVP Scope

| Priority | Capability                                         | Rationale                               |
| -------- | -------------------------------------------------- | --------------------------------------- |
| Must     | Patient registration form                          | Core entry point for all workflows      |
| Must     | Patient ID generation                              | Ensures unique tracking                 |
| Must     | Queue management system                            | Central operational workflow            |
| Must     | Update patient status (waiting, in-progress, done) | Tracks patient lifecycle                |
| Must     | Care plan tracker                                  | Enables follow-up care                  |
| Should   | Basic filtering/search                             | Improves staff efficiency               |
| Should   | AI triage scoring (feature-flagged)                | Optional enhancement for prioritization |
| Won’t    | Billing system                                     | Not needed for MVP                      |
| Won’t    | Insurance integration                              | Out of scope                            |
| Won’t    | Full EHR interoperability                          | Future phase                            |

---

## Feature Flags

* **ai-triage** → Enables AI-assisted urgency scoring
* **email-reminders** → Enables patient reminder notifications
* **care-plan-v2** → Unlocks improved care plan UI and workflow

---

## Success Metrics

| Metric                           | Target                              | How Measured      |
| -------------------------------- | ----------------------------------- | ----------------- |
| Patient registration time        | < 30 seconds                        | User testing      |
| Queue update latency             | < 1 second                          | System monitoring |
| Triage accuracy (baseline rules) | > 80% agreement with nurse decision | Validation study  |
| Staff task completion rate       | > 90% without assistance            | Field testing     |

---

## Technical Architecture

### Tech Stack

**Backend**

* Next.js (Express or Fastify)
* Postgresql (local DB)
* Zod for validation

**Frontend**

* Next.js (Vite)
* Tailwind CSS
* TanStack Query for server state

---

### Data Model

```ts
interface Patient {
  id: string;              // UUID or generated ID
  name: string;
  dob: string;
  contact: string;
  insurance?: string;
  symptoms: string;
  priorityScore: number;   // used for queue ordering
  status: 'waiting' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

```ts
interface CarePlan {
  id: string;
  patientId: string;
  notes: string;
  prescriptions?: string;
  followUpDate?: string;
  status: 'active' | 'completed' | 'archived';
}
```
---

## Core User Flows

### 1. Patient Intake Flow

Register patient → assign ID → add to queue → compute priority → display in dashboard

### 2. Nurse Queue Flow

Open queue → view sorted patients → select patient → update status → save care plan

### 3. Triage Flow (optional AI)

Enter symptoms → AI scoring runs (if enabled) → priority assigned → nurse overrides if needed

---

## Open Questions

* Should triage override be manual or always nurse-controlled?
* Do we persist historical patient visits or only active queue records?
* Should queue be real-time (WebSocket) or polling-based for MVP?

---

## Implementation Phases

| # | Phase                  | Description                              | Status  | Depends |
| - | ---------------------- | ---------------------------------------- | ------- | ------- |
| 1 | Backend foundation     | API setup, DB schema, patient CRUD       | pending | -       |
| 2 | Queue system           | Sorting, status updates, lifecycle logic | pending | 1       |
| 3 | Frontend dashboard     | Patient list, registration UI            | pending | 1       |
| 4 | Care plan module       | Notes + tracking system                  | pending | 2,3     |
| 5 | Feature flags + triage | AI toggle system + scoring               | pending | 2,3     |

---

## System Boundaries

**In Scope**

* Patient intake
* Queue prioritization
* Care plan tracking
* Lightweight clinical workflow support

**Out of Scope**

* Full hospital EHR system
* Billing/insurance processing
* Lab integration
* Prescription management systems


# Acceptance Criteria — Resident Health Command Center

## Patient Registration
- [ ] Registration form captures: name, DOB, contact, insurance, symptoms
- [ ] Auto-generates patient ID in format `PT-{YYYYMMDD}-{3-digit-hash}`
- [ ] Form validates required fields with Zod at runtime
- [ ] Registration completes in &lt;30 seconds

## Queue Management
- [ ] New patients appear in queue automatically
- [ ] Queue updates reflect in &lt;1 second
- [ ] Patients sorted by priority score (highest first)
- [ ] Staff can update status: waiting → in-progress → completed

## Care Plan
- [ ] Care plan can be created from patient record
- [ ] Notes, prescriptions, follow-up date are tracked
- [ ] Status: active, completed, archived

## Feature Flags
- [ ] `ai-triage`: When enabled, shows AI priority score column
- [ ] `email-reminders`: When enabled, shows "Send Reminder" button (stubbed)
- [ ] `care-plan-v2`: When enabled, shows enhanced care plan UI

## Performance
- [ ] Page load &lt;2 seconds
- [ ] Queue refresh &lt;1 second
- [ ] Filter/search responds immediately
