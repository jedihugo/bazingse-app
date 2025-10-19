# AGENTS.md

This file provides guidance to AI coding agents when working with the BaZingSe codebase.

## Project Overview

**BaZingSe** is a full-stack Chinese BaZi (Four Pillars/八字) astrology application analyzing birth charts and destiny interactions through time.

- **Frontend**: Nuxt 4 (Vue 3) + TailwindCSS + TypeScript
- **Backend**: Python FastAPI + sxtwl calendar library
- **Architecture**: Backend-driven calculation engine with frontend display layer

## Development Commands

### Frontend (Nuxt 3 - Port 3000)
```bash
cd /Users/macbookair/GitHub/bazingse-app
npm install
npm run dev  # http://localhost:3000
```

### Backend (FastAPI - Port 8008)
```bash
cd /Users/macbookair/GitHub/bazingse
source .venv/bin/activate
python run_bazingse.py  # http://localhost:8008
```

## Core Architecture Principles

### ⚠️ CRITICAL: Backend-Driven Design

**ALL BaZi calculations, logic, and astrology knowledge MUST live in the Python backend.**

**Frontend responsibilities (ONLY):**
- Collect user inputs
- Call backend APIs
- Display returned data
- Handle UI interactions (hover, click, toggle)

**Frontend must NEVER:**
- Calculate elements, stems, branches, or Ten Gods
- Implement BaZi rules or interaction logic
- Hardcode Chinese astrology knowledge

**Why?**
- Single source of truth for BaZi knowledge
- Uses battle-tested `sxtwl` library
- One place to fix/update calculations
- Consistent across all clients

### 18-Node System Architecture

The system can calculate up to **9 pillars × 2 nodes each = 18 nodes:**

**Natal Chart (8 nodes - always present):**
- 4 Heavenly Stems: `hs_y`, `hs_m`, `hs_d`, `hs_h`
- 4 Earthly Branches: `eb_y`, `eb_m`, `eb_d`, `eb_h`

**Temporal Luck Pillars (up to 10 additional nodes):**
- **10-Year Luck** (大运): `hs_10yl`, `eb_10yl` - Position 4
- **Annual Luck** (年運): `hs_yl`, `eb_yl` - Position 5
- **Monthly Luck** (月運): `hs_ml`, `eb_ml` - Position 6
- **Daily Luck** (日運): `hs_dl`, `eb_dl` - Position 7
- **Hourly Luck** (時運): `hs_hl`, `eb_hl` - Position 8

**Position System:**
```
0=Year | 1=Month | 2=Day | 3=Hour || 4=10YL | 5=Annual | 6=Monthly | 7=Daily | 8=Hourly
                                      ↑                                                 ↑
                              natal (spatial)                               temporal (overlays)
```

### Temporal Overlay Metaphysics

**Core BaZi Principle:**
Luck pillars (10Y, Annual, Monthly, Daily, Hourly) are NOT spatial positions—they are **temporal overlays** affecting the ENTIRE natal chart equally.

**Backend Implementation:**
- `calculate_interaction_distance()` in `app/bazingse.py` treats luck positions (4-8) as **distance=0** to ALL natal positions (0-3)
- All luck-natal interactions receive full adjacency strength
- Luck-luck interactions use normal distance
- This ensures luck pillars interact equally with Year, Month, Day, and Hour (no spatial bias)

## Backend Structure

**Location:** `/Users/macbookair/GitHub/bazingse/app/`

**Key Modules:**
- `routes.py` - FastAPI endpoint definitions (main: `/analyze_bazi`)
- `bazingse.py` - Core 18-node interaction engine with `analyze_8_node_interactions()`
- `library.py` - BaZi constants (stems, branches, Ten Gods, interactions)
- `chart_constructor.py` - Chart generation, luck pillar timing calculations
- `interaction.py` - Pattern analysis helpers (combinations, clashes, harmonies)

**Main API Endpoint:**
```
GET /analyze_bazi
Parameters:
  - birth_date: YYYY-MM-DD (required)
  - birth_time: HH:MM (optional, "unknown" for missing hour)
  - gender: "male" | "female" (required)
  - analysis_year: int (optional, triggers 10-year + annual luck)
  - include_annual_luck: bool (default: true)
  - analysis_month: int 1-12 (optional, adds monthly luck)
  - analysis_day: int 1-31 (optional, adds daily luck)
  - analysis_time: HH:MM (optional, adds hourly luck)

Returns:
  - birth_info: Birth details
  - analysis_info: Time period flags (has_luck_pillar, has_annual, has_monthly, etc.)
  - All nodes: hs_y, hs_m, hs_d, hs_h, hs_10yl, hs_yl, hs_ml, hs_dl, hs_hl (present nodes only)
                eb_y, eb_m, eb_d, eb_h, eb_10yl, eb_yl, eb_ml, eb_dl, eb_hl
  - base_element_score: Pre-interaction element scores (flat dict: stem_id → score)
  - post_element_score: Post-interaction element scores
  - interactions: Complete interaction dictionary (key: "TYPE~Pattern~nodes")
  - daymaster_analysis: Day master strength analysis
  - mappings: Reference tables (heavenly_stems, earthly_branches, ten_gods)
```

**Interaction Types Calculated:**
- Six Harmonies (六合), Clashes (相冲), Harms (相害), Punishments (相刑)
- Three Meetings (三會), Three Combinations (三合), Half Combinations (半合)
- Stem Combinations (天干合), Stem Conflicts (天干沖)
- Destructions (相破), Seasonal adjustments

## Frontend Structure

**Location:** `/Users/macbookair/GitHub/bazingse-app/`

**Main File:** `pages/index.vue` (~3300 lines)
- All-in-one interface: inputs, chart display, interactions, analysis
- Single-file component (SFC) with `<template>`, `<script setup>`, `<style>`

**API Proxy Layer:** `server/api/bazi/[...path].ts`
- Proxies all requests to `http://localhost:8008`
- Handles CORS and query string forwarding

**Key State Management (in index.vue):**
- `chartData` - Complete backend response
- `currentLuckPillar` - 10-year luck timing info
- `annualLuckPillar` - Annual luck data
- `showAnalysisPeriod` - "Time Travel" mode toggle
- `includeAnnualLuck`, `includeMonthlyLuck`, `includeDailyLuck`, `includeHourlyLuck` - Toggle controls

**Data Flow:**
1. User fills birth inputs + toggles "Time Travel" mode (🔮)
2. Frontend calls `/api/bazi/analyze_bazi?...` with parameters
3. Nuxt proxy forwards to backend `http://localhost:8008/analyze_bazi`
4. Backend calculates nodes + interactions
5. Frontend extracts data from response
6. UI renders pillars, interactions, elements, analysis

## UI/UX Design

### Time Travel Mode (🔮 Toggle)

**Progressive Input Cascade:**
```
🔮 Time Travel OFF: Show only natal chart (4 pillars)

🔮 Time Travel ON:
  ↓ Shows 10-Year Luck + Annual inputs
  ☑️ Annual (enabled) → Year input shown
    ↓ Enter year → Monthly input appears
    ☑️ Monthly (enabled) → Month input shown
      ↓ Enter month → Daily input appears
      ☑️ Daily (enabled) → Day input shown
        ↓ Enter day → Hourly input appears
        ☑️ Hourly (enabled) → Time input shown
```

**Toggle Checkbox Behavior:**
- Checkboxes gate BOTH display AND calculations
- Unchecking a level excludes that pillar from API call → no interactions calculated
- Cascading reset: Unchecking Annual clears Monthly/Daily/Hourly; unchecking Monthly clears Daily/Hourly

### Visual Design

**Pillar Borders (only 2 colored):**
- **Blue** (`border-blue-500`) = Day pillar (Day Master/日主)
- **Purple** (`border-purple-500`) = 10-Year Luck pillar (大运)
- No colored borders for: Year, Month, Hour, Annual, Monthly, Daily, Hourly

**Gold Theme for Temporal Inputs (Annual/Monthly/Daily/Hourly):**
- Background: `#F5F1E8` (cream gold)
- Border: `#C9B037` (Robinhood gold)
- Text: `#8B7355` (gold-brown)
- Badge: `#FEF3C7` background, `#92400E` text, `#D97706` border
- Checkbox accent: `#C9B037`
- When disabled: Grey with 60% opacity + grayscale

**Purple Gradient Dividers:**
- Vertical purple gradients wrap ONLY the 10-year luck pillar
- Visual separation: `Natal || 10Y Luck || Annual | Monthly | Daily | Hourly`
- Reinforces 10-year luck's special temporal overlay status

**Chart Layout (horizontal grid, 4-9 columns):**
```
Hour | Day | Month | Year || 10Y || Annual | Monthly | Daily | Hourly
時   | 日  | 月    | 年   || 運  || 年運   | 月運    | 日運  | 時運
(pos0) (pos1) (pos2) (pos3)  (pos4) (pos5)  (pos6)   (pos7) (pos8)

Purple dividers here: ↑              ↑
```

### Interaction Display

**Pillar Column Interaction Cards:**
- Each pillar shows its interactions below branch row
- Green background = positive (harmonies, combinations)
- Red background = negative (clashes, harms, punishments)
- Subtitle shows "with [Other Pillar]"
- Hover highlights ALL involved nodes with blue rings

**Interaction Log (expandable):**
- Detailed list of ALL interactions
- Shows node names, types, patterns, effects
- Filterable (hides natural energy flows)

## Key Implementation Patterns

### Backend Development

**Adding New Calculations:**
1. Update `app/library.py` if new constants needed
2. Add logic to `app/bazingse.py` or `app/interaction.py`
3. Expose via new parameter in `app/routes.py` or modify existing endpoint
4. Return all calculated data in response (frontend should not re-calculate)

**Position System Rules:**
- Positions 0-3: Natal chart (spatial, normal distance calculation)
- Positions 4-8: Luck pillars (temporal overlay, distance=0 to natal)
- Use `position_to_index` dict to map position codes to indices
- Always update `position_codes` list when adding new luck pillars

### Frontend Development

**NO BaZi Logic in Frontend:**
```javascript
// ❌ WRONG - Frontend calculating Ten God
function getTenGod(dayMaster, stem) {
  if (dayMaster === 'Jia' && stem === 'Yi') return 'R' // NO!
}

// ✅ CORRECT - Backend lookup only
const tenGod = chartData.mappings.ten_gods[dayMasterStem][stem].abbreviation
```

**Adding New Temporal Pillar Display:**
1. Add toggle ref: `const includeXLuck = ref(true)`
2. Add to localStorage save/load
3. Add checkbox in input header section
4. Add conditional in API URL builder: `if (valueX && includeXLuck.value) apiUrl += '&param_x=...'`
5. Add to `getPillarInteractionData()` indexToNodePos mapping
6. Add to `luckPillarInteractions` node checking
7. Add to `formatNodeName()` display mapping
8. Add gold styling to input/label when enabled

**State Management:**
- Use Vue refs in `<script setup>` (no Pinia/Vuex stores)
- localStorage for persistence across reloads
- Computed properties for derived data
- Watch for cascading resets on toggle changes

## Common Tasks

### Restart Backend with Changes
```bash
cd /Users/macbookair/GitHub/bazingse
pkill -f "python.*run_bazingse"
source .venv/bin/activate && nohup python run_bazingse.py > /tmp/bazingse.log 2>&1 &
```

### Test API Directly
```bash
curl "http://localhost:8008/analyze_bazi?birth_date=1986-11-29&birth_time=01:30&gender=male&analysis_year=2025&include_annual_luck=true&analysis_month=10" | python3 -m json.tool
```

### Check Interactions
```bash
# Count interactions by type
curl "..." 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Total: {len(d.get(\"interactions\",{}))}'); [print(k.split('~')[0]) for k in d.get('interactions',{}).keys()]" | sort | uniq -c
```

## Important Files

**Backend:**
- `/Users/macbookair/GitHub/bazingse/app/routes.py` - API endpoints
- `/Users/macbookair/GitHub/bazingse/app/bazingse.py` - Interaction engine (2866 lines)
- `/Users/macbookair/GitHub/bazingse/app/library.py` - BaZi constants

**Frontend:**
- `/Users/macbookair/GitHub/bazingse-app/pages/index.vue` - Main UI (3283 lines)
- `/Users/macbookair/GitHub/bazingse-app/server/api/bazi/[...path].ts` - API proxy

**Dependencies:**
- Backend: `fastapi`, `uvicorn`, `sxtwl`, `python-dotenv`
- Frontend: `nuxt@^4.1.3`, `vue@^3.5.22`, `@nuxtjs/tailwindcss`

## Design Principles

1. **Backend is Source of Truth** - Never calculate BaZi logic in frontend
2. **KISS** - Keep solutions simple and understandable
3. **Flat Data Structures** - Avoid deep nesting (max 1 level)
4. **Progressive Enhancement** - Features appear as user provides more input
5. **Visual Clarity** - Colors and borders indicate pillar types and interactions
6. **Temporal Overlay Concept** - Luck pillars interact equally with all natal pillars

## Troubleshooting

**Interactions not showing for Monthly/Daily/Hourly:**
- Check backend restarted after `bazingse.py` position code changes
- Verify API params sent: `console.log('Calling API:', apiUrl)` in `generateChart()`
- Check response: `has_monthly`, `has_daily`, `has_hourly` flags
- Verify `getPillarInteractionData()` includes positions 6, 7, 8

**Pillar appears but greyed out:**
- Check toggle checkbox state (must be enabled)
- Verify API param sent when toggle is true
- Check `includeXLuck` ref in API URL builder

**Backend changes not reflecting:**
- Restart backend server (Python doesn't hot-reload all changes)
- Check `/tmp/bazingse.log` for errors
- Test endpoint directly with `curl` to isolate issue

---

**Last Updated:** 2025-01-19 (18-node system with gold theme)
