# 🛡️  Project Guardrails & Architecture Guide  
*Next.js Mapping Suite – Back-office + Front-office*

> Keep this file in the root of the repo.  
> **Every commit or pull-request must satisfy every rule below.**  
> If a rule must be broken, create an issue first and obtain approval.

---

## 📑  Table of Contents
1. [Scope & Deliverables](#scope--deliverables)  
2. [Tech Stack](#tech-stack)  
3. [Folder Layout (immutable)](#folder-layout-immutable)  
4. [Coding Standards & Conventions](#coding-standards--conventions)  
5. [Mapping Constraints](#mapping-constraints)  
6. [Feature Matrix – Back-office vs Front-office](#feature-matrix)  
7. [Environment & Secrets](#environment--secrets)  
8. [Testing, Linting & CI Gates](#testing-linting--ci-gates)  
9. [Commit & PR Checklist](#commit--pr-checklist)  
10. [Changelog Discipline](#changelog-discipline)

---

## 1  Scope & Deliverables
| Phase | Must ship | “Done” means … |
|-------|-----------|----------------|
| **0** | Skeleton + stable Google Map on `/` (Back-office) | Map renders once, passes CI |
| **1** | Back-office core (provider selector, icon CRUD, distance panel, dashboard table) | All UI functional, 80 % test cover |
| **2** | Front-office slice (read-only map, layer toggles, dynamic table) | Live data from store, same CI gates |
| **3** | Additional providers (Mapbox/Here) + polishing | Provider switch works, docs updated |

---

## 2  Tech Stack
| Area | Choice | Notes |
|------|--------|-------|
| Framework | **Next.js 14 – App Router** | Pages = `src/app/*/page.tsx` |
| Language  | **TypeScript** (`"strict": true`) | Zero `any` / `@ts-ignore` |
| Styling   | **Tailwind CSS** | Global CSS only in `src/app/globals.css` |
| State     | **Zustand** + React Context | Store files under `src/store` |
| Maps      | Provider abstraction (`MapProvider` interface) | First impl = Google |
| Tests     | **Jest** + React-Testing-Library | `vitest` optional for units |
| Lint      | **ESLint (airbnb-plus-next)** + Prettier | Husky pre-commit hook |
| Build     | **pnpm** | lockfile committed |
| Icons     | React-Icon or SVGs | Uploaded SVG/PNG stored in `public/icons` |

---

## 3  Folder Layout (immutable)

src/
app/ ← Next.js App Router
layout.tsx
page.tsx ← Back-office home (phase 0)
globals.css
components/ ← Pure UI; no business logic
features/
backoffice/
components/
pages/
frontoffice/
components/
pages/
hooks/
lib/
map/
MapProvider.ts ← interface
google/
GoogleMapsProvider.ts
mapbox/ ← phase 3
api/ ← fetch / REST helpers
store/
styles/ ← Tailwind extensions only
tests/ ← Jest/RTL files mirroring src/
public/
icons/ ← user-uploaded icons
.env.example

markdown
Copy
Edit

No new top-level folders.  
No file more than **three** directories deep.

---

## 4  Coding Standards & Conventions

| Topic | Rule |
|-------|------|
| **1 file = 1 item** | One React function or one helper per file |
| **Exports** | `default export` **only** in page components; everything else named |
| **Props typing** | Use `interface`, not `type` alias |
| **Hook naming** | Starts with `use`, lives in `src/hooks` |
| **Services** | Pure functions under `src/lib` – never import React |
| **Styling** | Tailwind classes; **no** inline style objects |
| **Refs** | `useRef` guard (`didInit.current`) against double-mount loops |
| **Env use** | Browser code only via `NEXT_PUBLIC_*` variables |
| **Logging** | `console.*` allowed in dev; stripped or wrapped behind `process.env.NODE_ENV` check |
| **No DOM hacking** | No `document.querySelector`, `window.*` unless inside `useEffect` with SSR guard |

---

## 5  Mapping Constraints

* 🏷 **Marker labels hidden** (set `label:''` or equivalent)  
* 🔒 **Zoom locked** (`gestureHandling:'none'`; wheel & pinch disabled)  
* 🗂 **Layers togglable** (terrain, hotel, airport, …) via store events  
* 📍 Custom icons loaded from `/public/icons` selected in Back-office  
* 📏 Distances via Google **Distance Matrix API**; results cached (`localStorage`)  
* 🔄 All map interactions emit typed events to Zustand store → tables react live

---

## 6  Feature Matrix

| Feature                                 | Back-office | Front-office |
|-----------------------------------------|:-----------:|:------------:|
| Provider selector (Google, Mapbox …)    | ✓           | ✗ |
| Custom icon upload / CRUD               | ✓           | ✗ |
| Distance & geolocation tools            | ✓           | ✗ |
| Read-only interactive map               | ✗           | ✓ |
| Layer checklist (toggle visibility)     | ✓           | ✓ |
| Dynamic action table / dashboard        | ✓           | ✓ |

---

## 7  Environment & Secrets

1. **`.env.example`** – committed; lists all vars *without* secrets.  
2. **`.env.local`** – ignored; dev machine only.  
3. Mandatory keys:  

   ```dotenv
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
   NEXT_PUBLIC_MAPBOX_TOKEN=      # phase 3
8 Testing, Linting & CI Gates
Command	Must pass before merge
pnpm lint	ESLint with airbnb-plus-next
pnpm format	Prettier check (--check)
pnpm test	Jest; 80 % line coverage on touched files
pnpm tsc --noEmit	TS strict type-check
pnpm vitest run	(Optional) lightweight unit pass

Add a unit test for every new hook, helper, or component containing logic.

9 Commit & PR Checklist
 Folder / file paths match section 3 exactly

 All CI gates (section 8) green

 Added/updated storybook docs if component API changed

 CHANGELOG.md entry added (see next section)

 PR description lists which rules were validated (✓) or intentionally skipped (why)

10 Changelog Discipline
File lives at repo root: CHANGELOG.md

Append one line per PR – newest on top

css
Copy
Edit
2025-06-22 – [alice] – Added GoogleMapsProvider & MapWrapper – src/lib/map/ 
Keep lines ≤ 120 chars; no bullet lists.