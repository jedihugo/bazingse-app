# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BaZingSe is a full-stack BaZi (Four Pillars/八字) astrology application with a Nuxt 3 frontend and FastAPI backend. The system calculates Chinese astrology birth charts based on birth date/time and analyzes complex element interactions.

## Common Development Commands

### Frontend (Nuxt 3)
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

### Backend (FastAPI)
```bash
# Navigate to backend directory
cd /Users/macbookair/GitHub/bazingse

# Setup virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server (http://localhost:8008)
python run_bazingse.py
```

## Architecture

### Full-Stack Data Flow
1. User inputs birth data in frontend (`pages/index.vue`)
2. Frontend calls `/api/bazi` proxy endpoint
3. Nuxt server proxies to backend `http://localhost:8008/generate_natal_chart`
4. Backend calculates using 8-node architecture (4 Heavenly Stems + 4 Earthly Branches)
5. Backend returns node-based JSON with interactions and element scores
6. Frontend composable (`useBaziData.ts`) transforms data for UI display
7. UI renders chart with pillars, interactions, and analysis

### Frontend Structure

**Tech Stack:**
- **Framework**: Nuxt 3 (v4.0.3) with Vue 3
- **Styling**: TailwindCSS with custom configuration in `assets/css/main.css`
- **TypeScript**: Full type safety with interfaces in `types/bazi.ts`
- **Font**: Roboto Condensed from Google Fonts

**Key Components:**
- `pages/index.vue`: Main BaZi chart interface with birth date/time/gender inputs
- `components/BaZiChatInput.vue`: Natural language input component for date/time/gender
- `composables/useBaziData.ts`: Central state management and data transformation logic
- `types/bazi.ts`: TypeScript interfaces for both new node-based API and legacy UI formats

**API Proxy Layer:**
- `server/api/bazi.get.ts`: Main proxy to backend `/generate_natal_chart`
- `server/api/parse-input.post.ts`: Natural language parsing via backend `/parse_input`
- `server/api/bazi/[...path].ts`: Catch-all proxy for additional backend routes

### Backend Structure

**Tech Stack:**
- **Framework**: FastAPI with automatic API documentation
- **Calendar**: sxtwl for Chinese calendar calculations
- **Validation**: Pydantic models for request/response schemas
- **Server**: Uvicorn with hot reload support

**Module Organization:**
- `run_bazingse.py`: Entry point initializing FastAPI app
- `app/endpoint.py`: API route definitions and Pydantic models
- `app/library.py`: Core BaZi constants (Heavenly Stems, Earthly Branches, Ten Gods)
- `app/chart_constructor.py`: Chart generation and luck pillar calculations
- `app/interaction.py`: Pattern analysis (combinations, clashes, harmonies)
- `app/bazingse.py`: Main 8-node interaction analysis engine

**Available API Endpoints:**
- `/generate_natal_chart`: Main chart generation with 8-node analysis
- `/generate_10lp_chart`: Generate 10-year luck pillars
- `/generate_annual_pillars`: Annual luck calculations
- `/generate_monthly_pillars`: Monthly luck calculations
- `/generate_daily_pillars`: Daily luck calculations
- `/analyze_seasonal_directions`: Seasonal combination analysis
- `/analyze_three_combinations`: Three harmony analysis
- `/analyze_six_harmonies`: Six harmony analysis
- `/analyze_punishments`: Punishment pattern analysis

### Core BaZi Calculation Logic

**8-Node Architecture:**
- 4 Heavenly Stems (hs_y, hs_m, hs_d, hs_h) + 4 Earthly Branches (eb_y, eb_m, eb_d, eb_h)
- Each node maintains independent element inventory with qi scores
- Interactions only affect specific involved nodes

**Interaction Evaluation (3-step process):**
1. **DETECTION**: Check if required stems/branches exist
2. **DISTANCE**: Calculate position (adjacent=strongest, distance 1=moderate, 2+=weak)
3. **TRANSFORMATION**: Check if transforming element exists in corresponding pillar

**Element Scoring System:**
- Base score: 10pts per stem/branch
- Distance bonuses: Adjacent +10pts, Distance 1 +5pts
- Transformation bonus: +40pts if element exists
- Each element tracks both score (strength) and count (quantity)

### Data Format Transformation

The backend returns a node-based structure that the frontend transforms for UI compatibility:
- Backend format: Individual nodes (hs_y, eb_y, etc.) with base/post states
- Frontend format: Pillar-based structure (year, month, day, hour) for display
- Transformation handled in `composables/useBaziData.ts`

### Important Development Patterns

**Frontend:**
- Use composable (`useBaziData`) for state management, not stores
- All backend calls proxy through `/api/bazi/*` to handle CORS
- TypeScript interfaces ensure type safety across data flow
- Natural language parsing handled via dedicated backend endpoint

**Backend:**
- KISS principle: Keep solutions simple for middle-school level understanding
- Avoid deeply nested JSON - keep structures flat (max 1 level deep)
- Always reference constants in `library.py` for consistency
- No test suite currently - consider adding pytest for critical calculations
- No linting configuration - consider adding ruff for code quality

### Backend Dependency
The frontend requires the Python backend API running on `http://localhost:8008` with endpoints:
- `/generate_natal_chart`: Main BaZi chart generation
- `/parse_input`: Natural language date/time parsing
- Additional analysis endpoints for various interaction patterns