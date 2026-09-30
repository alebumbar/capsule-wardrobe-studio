# Capsule Wardrobe Studio

A guided portfolio project for learning product design and building a polished React + TypeScript application.

## Run the project

```bash
npm install
npm run dev
```

Before coding, read [`docs/PRODUCT_BRIEF.md`](docs/PRODUCT_BRIEF.md).

## What is already set up

- Vite, React, and strict TypeScript
- ESLint
- Vitest and Testing Library
- Responsive application shell
- CSS design tokens for colour, spacing, type, radius, and elevation
- An accessible empty state and first interaction test
- A narrow product brief that protects the MVP from scope creep

## Learning roadmap

Work through one milestone at a time. Each milestone should finish with working UI, tests, and a short written reflection.

### Milestone 1 — Add a garment

Build a form inside the existing panel. Do not add a backend yet.

Fields:

- Name (required)
- Category: top, bottom, dress, outerwear, shoes, accessory
- Primary colour
- Season: all-season, spring/summer, autumn/winter

Your first tasks:

1. Create `src/types/garment.ts` and define the `Garment` type.
2. Create `src/components/GarmentForm.tsx`.
3. Use real `<label>` elements and show a clear validation message for an empty name.
4. Store submitted garments in `App` state.
5. Replace the empty state with a simple list after the first garment is added.
6. Add tests for invalid and successful submission.

Definition of done:

- The flow works using only the keyboard.
- Invalid input explains how to fix it.
- Submitting updates the screen immediately.
- Tests cover the user behaviour rather than implementation details.
- `npm run lint`, `npm test`, and `npm run build` all pass.

### Milestone 2 — Garment cards and filtering

Design the garment card in Figma first. Implement category, colour, and season filters. Make filter state visible and provide a useful zero-results state.

### Milestone 3 — Persistence and API

Move garments from local state to an API and database. Add loading, error, retry, and optimistic states.

### Milestone 4 — Outfit builder

Let users select compatible garments, preview a combination, name it, and save it. Ensure selection works without drag-and-drop.

### Milestone 5 — Authentication and private wardrobes

Add accounts, protected data, authorization checks, and a public read-only outfit link.

### Milestone 6 — Portfolio case study

Document the problem, early sketches, user feedback, design system, technical decisions, accessibility, tests, trade-offs, and what changed after observation.

## How we will work together

For each milestone:

1. You make the first small attempt.
2. Share the result or ask for the next task.
3. We review the design and code together.
4. You revise it and record what you learned.

The immediate next step is **Milestone 1, task 1**: define the garment data model before building its form.
