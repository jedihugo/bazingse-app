# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BaZingSe is a Nuxt 3 application for BaZi (Chinese fortune telling) calculations. The app communicates with a Python backend API running on localhost:8008 for chart generation.

## Common Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Framework**: Nuxt 3 with Vue 3
- **Styling**: TailwindCSS
- **TypeScript**: Full type safety with interfaces in `types/bazi.ts`

### Key Components

**Frontend Structure:**
- `pages/index.vue`: Main BaZi chart interface with input fields for birth date/time and gender selection
- `composables/useBaziData.ts`: Central state management for BaZi data fetching and handling
- `types/bazi.ts`: TypeScript interfaces for all BaZi data structures (Pillar, NatalChart, LuckPillar, etc.)

**API Layer:**
- `server/api/bazi.get.ts`: Proxy endpoint that forwards requests to Python backend at localhost:8008
- `server/api/parse-input.post.ts`: Handles natural language date/time parsing
- `server/api/bazi/[...path].ts`: Catch-all proxy for additional backend routes

### Data Flow
1. User inputs birth date/time/gender in the UI
2. Frontend calls `/api/bazi` with parameters
3. Nuxt server proxies request to `http://localhost:8008/generate_chart`
4. Python backend generates BaZi chart data
5. Data flows back through proxy to frontend for display

### Important Patterns
- The app uses a composable (`useBaziData`) for centralized state management rather than a store
- API communication goes through Nuxt server middleware to handle CORS and proxy to the Python backend
- TypeScript interfaces ensure type safety across the entire data flow