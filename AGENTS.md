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
Display Order (Left to Right):
Hour | Day | Month | Year || 10Y Luck || Annual | Monthly | Daily | Hourly
時   | 日  | 月    | 年   || 運       || 年運   | 月運    | 日運  | 時運

Backend Position Codes:
0=Hour | 1=Day | 2=Month | 3=Year || 4=10YL | 5=Annual | 6=Monthly | 7=Daily | 8=Hourly
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

### Main Files

**Primary Interface:**
- `pages/index.vue` (~4311 lines)
  - All-in-one interface: inputs, chart display, interactions, analysis
  - Single-file component (SFC) with `<template>`, `<script setup>`, `<style>`
  - Quick Test Presets: Pre-configured birth data buttons for rapid testing
  - View mode toggle: Base (pre-interaction) vs Post (post-interaction with transformations)
  - Integrated interaction log panel (expandable sidebar)
  - WuXing flow indicators between pillars
  - Five element graphs with before/after comparison
  - Talisman system: Manual pillar override with Jia-Zi pair validation

**Components:**
- `components/BaZiChatInput.vue` (~172 lines) - Natural language input parsing (experimental)
- `components/JsonViewer.vue` (~374 lines) - Interactive JSON viewer with search, expand/collapse, and copy functionality

**Composables:**
- `composables/useBaziData.ts` (~422 lines) - State management composable (currently unused in favor of inline state)
  - Provides: generateChart, updateBaziData, selectLuckPillar, etc.
  - Note: index.vue currently implements state management inline
  - Includes legacy format transformation for backward compatibility

**Type Definitions:**
- `types/bazi.ts` (~194 lines) - Complete TypeScript interfaces for all BaZi data structures
  - Node structures (BaziNode, NodeState, QiValue)
  - API response types (NatalChartResponse, LuckPillarResponse)
  - Legacy compatibility types (Pillar, LuckPillar, AnnualPillar, etc.)
  - Element type definitions

**Utilities:**
- `utils/baziHelpers.ts` - Helper functions for BaZi calculations and formatting
  - Element color mappings (Yang/Yin variations)
  - Ten Gods abbreviation mappings
  - Stem/branch Chinese character mappings
  - Element extraction from Chinese characters
  - Color functions with brightness adjustment

### API Proxy Layer

**Multiple Endpoint Proxies:**
- `server/api/bazi/analyze_bazi.get.ts` - Main endpoint for full chart analysis (18-node system)
- `server/api/bazi/generate_natal_chart.get.ts` - Natal chart only endpoint (with score conversion)
- `server/api/bazi.get.ts` - Alternative direct analyze_bazi proxy
- `server/api/parse-input.post.ts` - Natural language input parsing proxy
- `server/api/bazi/[...path].ts` - Catchall proxy for other backend endpoints

All proxies forward to `http://localhost:8008` and handle CORS.

### Key State Management (in index.vue)

**Chart Data:**
- `chartData` - Complete backend response (18-node system data)
- `currentLuckPillar` - Current 10-year luck timing info
- `annualLuckPillar` - Current annual luck pillar

**Input State:**
- `birthDate`, `birthTime`, `gender` - Birth information
- `yearInput`, `monthInput`, `dayInput` - Separated date inputs for UI
- `unknownHour` - Toggle for missing hour pillar

**Time Travel State:**
- `showAnalysisPeriod` - "Time Travel" mode toggle
- `analysisYear`, `analysisMonth`, `analysisDay`, `analysisTime` - Analysis period parameters
- `includeAnnualLuck`, `includeMonthlyLuck`, `includeDailyLuck`, `includeHourlyLuck` - Progressive pillar toggles

**View State:**
- `viewMode` - Toggle between 'base' (pre-interaction) and 'post' (post-interaction with transformations)
- `showInteractionLog` - Toggle for interaction log panel visibility (default: true)
- `hoveredNode`, `hoveredInteraction`, `highlightedNodes` - Hover state for interactive highlighting
- `highlightContext` - Stores interaction context for element-based coloring
- `hoveredTransformationId` - Track which transformation is being hovered
- `activeConnections` - Array of active connection lines between nodes
- `showConnections` - Toggle for displaying connection lines between interacting nodes
- `tooltipContent`, `tooltipPosition` - Dynamic tooltip state

**Talisman State:**
- `showTalismans` - Toggle for talisman pillar display
- `talismanYearHS`, `talismanYearEB` - Year talisman stem/branch overrides
- `talismanMonthHS`, `talismanMonthEB` - Month talisman stem/branch overrides
- `talismanDayHS`, `talismanDayEB` - Day talisman stem/branch overrides
- `talismanHourHS`, `talismanHourEB` - Hour talisman stem/branch overrides

### Data Flow

1. User fills birth inputs + toggles "Time Travel" mode (🔮)
2. Frontend calls `/api/bazi/analyze_bazi?...` with progressive parameters
3. Nuxt proxy forwards to backend `http://localhost:8008/analyze_bazi`
4. Backend calculates nodes + interactions (up to 18 nodes)
5. Frontend extracts data from response
6. UI renders:
   - 4-9 pillars (natal + active luck pillars)
   - Base vs Post view toggle
   - WuXing flow indicators
   - Five element graphs (before/after)
   - Interaction badges on each node
   - Expandable interaction log panel

## UI/UX Design

### Quick Test Presets

**Pre-configured Test Data:**
- Row of quick-access buttons with preset birth data for rapid testing
- Each button shows: date, time, gender symbol (♀/♂)
- Color-coded: Pink for female, Blue for male
- Hover effect with scale animation
- Automatically loads preset data on click
- Located at top of interface for easy access

**Current Presets:**
1. 1969-07-04 18:20 ♀
2. 1992-07-06 09:30 ♀ (default)
3. 1995-04-19 17:30 ♂
4. 1985-06-23 13:30 ♂
5. 1988-02-02 13:30 ♂

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

**Pillar Borders (6 distinct colors):**
- **Blue** (`border-blue-500`) = Day pillar (Day Master/日主) - Always position 1
- **Purple** (`border-purple-500`) = 10-Year Luck pillar (大运) - Position 4
- **Orange** (`border-orange-500`) = Annual Luck pillar (年運) - Position 5
- **Green** (`border-green-500`) = Monthly Luck pillar (月運) - Position 6
- **Indigo** (`border-indigo-500`) = Daily Luck pillar (日運) - Position 7
- **Pink** (`border-pink-500`) = Hourly Luck pillar (時運) - Position 8
- No colored borders for: Year (pos 3), Month (pos 2), Hour (pos 0)

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

Purple gradient dividers: ↑           ↑
                    (wrap 10Y Luck only)
```

**View Mode Toggle:**
- **Base View**: Shows pre-interaction state (naive element scores)
- **Post View** (default): Shows post-interaction state with transformations
  - WuXing flow indicators (→ symbols between pillars)
  - Transformation badges on transformed nodes
  - Element changes displayed in graphs

**Interaction Badges:**
- **Transformation** badges: Element-based colors with strength indicators (★★, ★, ●, ○)
  - Ultra Strong: 32px, 2 stars
  - Strong: 28px, 1 star
  - Normal: 24px, filled dot
  - Weak: 20px, hollow dot
- **Combination** badges: Dashed borders with repeating diagonal pattern
- **Negative** badges (clash/harm/punishment): Red background with solid borders
- All badges are clickable/hoverable for interaction details and tooltips

**Five Element Graphs:**
- Horizontal bar charts showing element distribution
- Grid lines dividing each 20% segment
- Base view: Single bar per element
- Post view: Dual bars with arrows showing change (naive → final)
- Color-coded by element with relationship labels (support/drain/neutral)

### Talisman System

**Manual Pillar Override:**
- Toggle-able talisman row (🧿 Talisman button)
- Allows manual override of natal pillars with custom stems/branches
- Four input pairs: Year, Month, Day, Hour
- Each pair has dropdown selectors for Heavenly Stem and Earthly Branch
- Real-time Jia-Zi pair validation (60 valid combinations)
- Invalid pairs marked with ⚠️ warning and red border
- Valid pairs show teal border and background
- Talisman pillars render below natal chart with full interaction calculation
- Useful for:
  - Testing hypothetical charts
  - Analyzing auspicious dates
  - Feng Shui adjustments
  - Name/logo selection timing

**Validation:**
- Uses `isValidJiaziPair(stem, branch)` function
- Checks against 60-element Jia-Zi cycle
- Visual feedback via `hasInvalidTalismanPairs` computed property
- Prevents calculation with invalid combinations

### Interaction Display

**Pillar Column Interaction Cards:**
- Each pillar shows its interactions below branch row
- Green background = positive (harmonies, combinations)
- Red background = negative (clashes, harms, punishments)
- Subtitle shows "with [Other Pillar]"
- Hover highlights ALL involved nodes with blue rings

**Interaction Log (expandable sidebar panel):**
- Right-side panel showing detailed list of ALL interactions
- Expandable/collapsible with toggle button
- Shows for each interaction:
  - Interaction type and pattern name
  - Node names involved (with Chinese characters)
  - Effect description
  - Stage indicator (pre/post)
- Hover sync: Hovering interaction in log highlights nodes in chart
- Click to focus: Clicking interaction scrolls and highlights it
- Filter toggle to hide natural energy flow interactions

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
2. Add to localStorage save/load in `saveToStorage()` and `loadFromStorage()`
3. Add checkbox in input header section with gold theme styling
4. Add conditional in API URL builder in `generateChart()`: `if (valueX && includeXLuck.value) apiUrl += '&param_x=...'`
5. Update `luckPillarsOrdered` computed to extract new pillar from `chartData`
6. Add node mapping in `formatNodeName()` for display
7. Add border color class in pillar rendering template
8. Add to analysis info display panel badge section
9. Update `totalPillarCount` computed to include new pillar

**State Management:**
- Use Vue refs in `<script setup>` (no Pinia/Vuex stores)
- localStorage for persistence across reloads using `STORAGE_KEY` constant
- Computed properties for derived data (pillars, elements, interactions)
- Watch for cascading resets on toggle changes
- All state is reactive and triggers UI updates automatically

**Working with Node Data:**
- Always check `viewMode.value` to determine whether to use `base` or `post` node state
- Access node data via `chartData.value.hs_X` or `chartData.value.eb_X` where X is position code
- Use `node.base.qi` for pre-interaction qi scores
- Use `node.post_interaction_qi` for post-interaction qi scores
- Check `node.transformed`, `node.alive`, `node.interacted` flags for visual indicators
- Access badges via `node.badges` array (contains transformation, combination, negative badges)

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
- `/Users/macbookair/GitHub/bazingse/app/bazingse.py` - Interaction engine (~2900 lines)
- `/Users/macbookair/GitHub/bazingse/app/library.py` - BaZi constants
- `/Users/macbookair/GitHub/bazingse/app/chart_constructor.py` - Chart generation and luck pillar calculations
- `/Users/macbookair/GitHub/bazingse/app/interaction.py` - Pattern analysis helpers

**Frontend:**
- `/Users/macbookair/GitHub/bazingse-app/pages/index.vue` - Main UI (~4311 lines)
- `/Users/macbookair/GitHub/bazingse-app/components/JsonViewer.vue` - JSON debugging tool (~374 lines)
- `/Users/macbookair/GitHub/bazingse-app/components/BaZiChatInput.vue` - Natural language input parser (~172 lines)
- `/Users/macbookair/GitHub/bazingse-app/composables/useBaziData.ts` - State management composable (~422 lines)
- `/Users/macbookair/GitHub/bazingse-app/types/bazi.ts` - TypeScript type definitions (~194 lines)
- `/Users/macbookair/GitHub/bazingse-app/utils/baziHelpers.ts` - Helper utilities
- `/Users/macbookair/GitHub/bazingse-app/server/api/bazi/analyze_bazi.get.ts` - Main API proxy
- `/Users/macbookair/GitHub/bazingse-app/server/api/bazi.get.ts` - Alternative direct proxy
- `/Users/macbookair/GitHub/bazingse-app/server/api/bazi/generate_natal_chart.get.ts` - Natal chart proxy
- `/Users/macbookair/GitHub/bazingse-app/server/api/bazi/[...path].ts` - Catchall proxy
- `/Users/macbookair/GitHub/bazingse-app/server/api/parse-input.post.ts` - Chat input parser proxy

**Documentation:**
- `/Users/macbookair/GitHub/bazingse-app/AGENTS.md` - This file (agent guidance)
- `/Users/macbookair/GitHub/bazingse-app/FRONTEND_ENHANCEMENT_PLAN.md` - Implementation plan for time travel feature
- `/Users/macbookair/GitHub/bazingse-app/IMPLEMENTATION_SUMMARY.md` - Detailed implementation notes
- `/Users/macbookair/GitHub/bazingse-app/TESTING_GUIDE.md` - Comprehensive testing procedures

**Styling References:**
- `/Users/macbookair/GitHub/bazingse-app/badge-styling-guide.css` - Badge and node styling reference

**Dependencies:**
- Backend: `fastapi`, `uvicorn`, `sxtwl`, `python-dotenv`
- Frontend: 
  - Core: `nuxt@^4.1.3`, `vue@^3.5.22`, `vue-router@^4.6.3`
  - Styling: `@nuxtjs/tailwindcss@^6.12.1`
  - Dev: `@nuxt/devtools@^2.6.5`, `typescript@^5.9.3`
  - Fonts: JetBrains Mono (via Google Fonts CDN)

## Configuration

**Nuxt Config** (`nuxt.config.ts`):
- Compatibility date: 2024-04-03
- Modules: `@nuxtjs/tailwindcss`
- Custom CSS: `~/assets/css/main.css`
- Mobile-optimized meta tags:
  - Viewport: no-zoom, no-scale for mobile stability
  - Apple web app capable
  - Theme color: white
- JetBrains Mono font loaded via Google Fonts
- Tailwind CSS integration

## Design Principles

1. **Backend is Source of Truth** - Never calculate BaZi logic in frontend
2. **KISS** - Keep solutions simple and understandable
3. **Flat Data Structures** - Avoid deep nesting (max 1 level)
4. **Progressive Enhancement** - Features appear as user provides more input
5. **Visual Clarity** - Colors and borders indicate pillar types and interactions
6. **Temporal Overlay Concept** - Luck pillars interact equally with all natal pillars
7. **Responsive Design** - Mobile-first approach with touch-friendly controls

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

## Recent Major Changes

### Current Features (November 2025):
1. **Quick Test Presets** - One-click preset birth data for rapid testing
2. **Talisman System** - Manual pillar override with Jia-Zi validation
3. **View Mode Toggle** - Base vs Post interaction visualization
4. **JsonViewer Component** - Interactive JSON debugging with search/filter
5. **Interaction Log Panel** - Expandable sidebar with full interaction details
6. **WuXing Flow Indicators** - Visual arrows showing energy flow between nodes
7. **Five Element Graphs** - Before/after comparison with change indicators
8. **Transformation Badges** - Strength-based visual indicators (★★, ★, ●, ○)
9. **Progressive Pillar Display** - All 5 luck pillar types (10Y, Annual, Monthly, Daily, Hourly)
10. **Hover Interactions** - Synchronized highlighting between chart and log
11. **Connection Lines** - Toggle-able visual connections between interacting nodes
12. **TypeScript Types** - Complete type definitions with element types
13. **Mobile Optimization** - Touch-friendly controls and viewport settings

### Architecture Changes:
1. **State Management** - Inline Vue refs pattern (useBaziData composable exists but unused)
2. **API Endpoints** - Multiple specialized proxy endpoints with fallback support
3. **Node Structure** - Complete node data with badges, qi scores, strength indicators, interaction IDs
4. **Position System** - Confirmed 18-node system with 9 positions (0-8)
5. **Data Flow** - Frontend never calculates BaZi logic, all from backend API
6. **Styling System** - Element-based colors with Yang/Yin variations

### File Size Evolution:
- `pages/index.vue` - EXPANDED from ~3300 to ~4311 lines (+30%)
- `types/bazi.ts` - EXPANDED from ~140 to ~194 lines (+38%)
- `composables/useBaziData.ts` - REDUCED from ~470 to ~422 lines (refactored)
- `components/JsonViewer.vue` - Stable at ~374 lines

### Additional Documentation:
- `FRONTEND_ENHANCEMENT_PLAN.md` - Time travel feature implementation plan
- `IMPLEMENTATION_SUMMARY.md` - Detailed implementation notes and decisions
- `TESTING_GUIDE.md` - Comprehensive testing procedures and test cases
- `badge-styling-guide.css` - Visual styling reference for badges

---

**Last Updated:** 2025-11-02 (Comprehensive documentation audit with feature additions and file size corrections)
