# Peptide Tracker

A private, encrypted web app for tracking peptide protocols, dosage cycles, and adherence — built with React, Firebase, and Tailwind CSS.

## Features

- 🔒 **Fully private** — Firebase anonymous auth, data scoped per user
- 💉 **Peptide search** — 80+ peptides with category filtering
- 🔄 **Cycle tracking** — On/off day cycles with visual progress
- 📅 **Dose scheduling** — Daily and weekly frequency support
- 📊 **Dose history** — Per-peptide log with timestamps

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Database | Firebase Firestore |
| Auth | Firebase Anonymous Auth |
| Icons | Lucide React |
| Charts | Recharts |

## Getting Started

```bash
npm install
cp .env.example .env    # fill in your Firebase keys
npm run dev
```

## Environment Variables

See `.env.example` for required keys. Never commit `.env` directly.

## Firestore Rules

Rules enforce:
- Auth required for all reads/writes
- `name`, `dosage`, `frequency`, `createdAt` required on create
- `frequency` must be `daily` or `weekly`
- `createdAt` and `name` are immutable after creation

## Project Structure

```
src/
├── components/
│   ├── shared/          # Reusable UI (ModalShell, DosageInput, etc.)
│   └── *.jsx            # Page-level components
├── hooks/               # usePeptides, useCycleProgress
├── firebase/            # config.js, auth.js
└── utils/               # peptideDoc.js, searchCache.js
```
