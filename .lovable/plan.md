# VoiceGuard — Build Plan

A complete frontend for an AI scam-call detection platform for Indian users. Frontend-only build with mocked service layer (no real backend/API calls); all data seeded with realistic content.

## Tech & Setup
- Existing stack: TanStack Start + React + TS + Tailwind v4 + shadcn/ui (already installed). Recharts, react-hook-form, zod, zustand, @tanstack/react-query — install as needed.
- Note: project uses TanStack Start (file-based routes under `src/routes/`), not Vite-only React. Routes will follow that convention. The user's "React + Vite" requirement is satisfied at the runtime level (Vite under the hood).

## Design System (`src/styles.css`)
- Tokens in oklch matching the spec: primary #1A56DB, danger #E02424, warning #FF8800, safe #057A55, bg #F9FAFB, card #FFFFFF, text #111928, muted #6B7280, border #E5E7EB.
- Radius 12px on cards. Min 16px body, 32px+ result headings, min 48px tap targets.
- Fonts: Plus Jakarta Sans (headings), Inter (body) loaded via Google Fonts.
- Light default, dark mode toggle via class.

## Routes
```
src/routes/
  __root.tsx           (header/footer, providers, helpline floating widget, toaster)
  index.tsx            Landing
  demo.tsx             Live Mic Demo
  login.tsx
  signup.tsx
  awareness.tsx        Scam Awareness Feed
  phrases.tsx          Scam Phrase Library
  phone-check.tsx      Quick Phone Number Check
  safety-check.tsx     Safety Tips Checklist
  _app.tsx             Authenticated layout (sidebar + topbar)
  _app/dashboard.tsx
  _app/analyze.tsx     Upload + start analysis
  _app/result.$id.tsx  Analysis Result
  _app/history.tsx
  _app/complaint.tsx   5-step wizard
  _app/statistics.tsx
  _app/settings.tsx
```

## Shared Components (`src/components/`)
- `Header`, `Footer`, `AppSidebar`, `TopBar`
- `HelplineWidget` (mobile floating + desktop side widget)
- `OnboardingModal` (3 steps after signup)
- `AnalysisProgress` (4-step indicator)
- `RiskBadge`, `ScoreBar`, `RiskCircle`
- `Skeleton` loaders, toast via sonner

## State & Services
- Zustand store: auth (mock user), onboarding flag, theme.
- `src/services/`: `auriginService`, `assemblyService`, `complaintService`, `phoneCheckService`, `alertService`, `reportsService` — typed wrappers around `fetch(`${import.meta.env.VITE_API_URL}/...`)`. Since no backend exists, they fall back to seeded mock data so UI is fully functional.
- React Query for fetching, RHF + Zod for forms.

## Content (hardcoded, fully written)
- 10 awareness cards with full copy (titles, how-it-works, red flags, what-to-do).
- Phrase library: 5 categories × 8 phrases with tooltip explanations.
- 8 reported numbers, statistics seed data, weekly trend.

## Out of scope (per user)
No payments, no admin, no social login, no chat, no real backend calls.

## Verification
- After build: visit landing, dashboard, result page; check console for errors.

Confirm to proceed and I'll build it.