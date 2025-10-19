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

### ⚠️ CRITICAL: Backend-Driven Architecture

**ALL BaZi logic, calculations, and knowledge MUST reside in the Python FastAPI backend.**

The frontend is a "dumb client" responsible ONLY for:
- ✅ User input collection
- ✅ API calls to backend
- ✅ Data display and visualization
- ✅ UI interactions (hover, click, etc.)

The frontend MUST NEVER:
- ❌ Calculate BaZi elements, stems, branches
- ❌ Determine Ten Gods relationships
- ❌ Calculate interactions (clashes, harmonies, etc.)
- ❌ Implement any BaZi rules or logic
- ❌ Hardcode Chinese astrology knowledge

**Why Backend-Driven?**
1. **Single Source of Truth**: All BaZi knowledge in Python backend (`app/library.py`)
2. **Correctness**: Complex calculations use battle-tested `sxtwl` library
3. **Maintainability**: BaZi rules updated in one place (backend)
4. **Consistency**: Same logic for all clients (web, mobile, API)

**Examples:**

✅ **Correct (Backend-Driven):**
```javascript
// Frontend just does lookups from backend data
const dayMasterStem = chartData.hs_d.base.id
const tenGodData = chartData.mappings.ten_gods[dayMasterStem][currentStem]
const label = tenGodData.abbreviation  // Backend provided this table
```

❌ **WRONG (Frontend Logic):**
```javascript
// DO NOT calculate Ten Gods in frontend!
function calculateTenGod(dayMaster, stem) {
  if (dayMaster === 'Gui' && stem === 'Ren') return 'RW'  // NO!
  // ... more logic
}
```

**What Backend Provides:**
- Complete node data with qi scores
- All interactions pre-calculated
- Ten Gods relationship matrix (mappings.ten_gods)
- Element transformations
- Hidden stems data
- Timing calculations

**What Frontend Does:**
- Extract values from backend response
- Map data to UI components
- Display using Tailwind styling
- Handle user interactions (hover, etc.)

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
- **Framework**: Nuxt 4 (v4.1.3) with Vue 3
- **Styling**: TailwindCSS with custom configuration in `assets/css/main.css`
- **TypeScript**: Full type safety with interfaces in `types/bazi.ts`
- **Font**: JetBrains Mono from Google Fonts

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
- `/generate_natal_chart`: Main chart generation with 8-node analysis (natal chart only)
- `/generate_natal_with_current_luck`: **RECOMMENDED** Natal chart + current 10-year luck + current annual luck with ALL interactions calculated (12-node system)
- `/generate_10lp_chart`: Generate 10-year luck pillars with precise timing
- `/generate_annual_pillars`: Annual luck calculations
- `/generate_monthly_pillars`: Monthly luck calculations
- `/generate_daily_pillars`: Daily luck calculations
- `/analyze_seasonal_directions`: Seasonal combination analysis
- `/analyze_three_combinations`: Three harmony analysis
- `/analyze_six_harmonies`: Six harmony analysis
- `/analyze_punishments`: Punishment pattern analysis

**Luck Pillar System (大运 & 年運):**

**10-Year Luck Pillar (大运):**
- Current 10-year luck pillar is automatically displayed as a 5th column to the right of natal chart
- Luck pillar is treated as "adjacent" to the natal chart (position 4, next to hour pillar) for interaction calculations
- Displays timing information including age range and year range (e.g., "2022-2032, ages 30-40")
- Shown with **purple border** to distinguish from natal pillars
- Backend calculates precise start/end dates based on Chinese solar terms (Jieqi)

**Annual Luck Pillar (年運):**
- Current annual luck pillar displayed as a 6th column to the right of 10-year luck
- Position 5 (adjacent to 10-year luck at position 4) for interaction calculations
- Displays current year (e.g., "2025")
- Shown with **orange border** to distinguish from other pillars
- Automatically calculated for current year using Chinese calendar

**12-Node System:**
- Fully integrated into 8-node architecture as a **12-node system** (8 natal + 2 10-year + 2 annual)
- All classical BaZi interactions calculated between all 12 nodes

**Interaction Calculations:**
- **Wu Xing Energy Flow**: Displays generation (→) and control (⇢) arrows between all pillars including luck pillar
- **All Classical BaZi Interactions Supported**:
  - **Six Harmonies (六合)**: Harmonious branch combinations (e.g., Zi-Chou, Yin-Hai)
  - **Clashes (相冲)**: Opposing branches that clash (e.g., Zi-Wu, Yin-Shen)
  - **Harms (相害)**: Harmful branch relationships
  - **Punishments (相刑)**: Punishment patterns between branches
  - **Three Meetings (三會)**: Seasonal directional combinations
  - **Three Combinations (三合)**: Harmony triads
  - **Half Combinations (半合)**: Partial harmony combinations
  - **Stem Combinations (天干合)**: Heavenly stem mergers
  - **Stem Conflicts (天干沖)**: Heavenly stem clashes
  - **Destructions (相破)**: Destructive relationships

**Interaction Display:**
- **Backend Calculation**: ALL interactions calculated by sophisticated backend engine (bazingse.py)
- **Pillar Column Display**:
  - Each natal pillar column (Hour, Day, Month, Year) shows its interactions with the 10-year luck pillar
  - Luck pillar column shows all its interactions with natal pillars
  - Format: "10Y 六合" or "10Y 相冲" with descriptive subtitle
  - Green background for positive interactions (harmonies, combinations)
  - Red background for negative interactions (clashes, harms, punishments)
  - Summary also shown in purple luck pillar info box
- **Hover Highlighting**: Hover over any interaction badge to highlight the involved pillars with blue rings
- **Interaction Log**: Detailed log section shows all interactions including luck-natal interactions with:
  - Chinese and English labels
  - Node names (e.g., "10-Year Luck Stem", "Hour Stem")
  - Position indicators (e.g., "Hour → 10-Year Luck")
  - Effect percentages and descriptions
- **Grid Layout**: Automatically adapts between 4 columns (natal only) or 5 columns (natal + luck)
- **Data Flow**: Frontend extracts luck pillar interactions from backend response (no client-side calculation)

**Technical Implementation:**

**Backend (Python/FastAPI):**
- **Bug Fixes**:
  - Fixed `import math` in chart_constructor.py
  - Fixed qi iteration bug in endpoint.py (dict access instead of tuple unpacking)
  - Fixed stem conflict logic to allow nodes to participate in multiple conflicts
- **Core Engine Updates** (bazingse.py):
  - Modified `analyze_8_node_interactions()` to support **12 nodes** (8 natal + 2 10-year + 2 annual)
  - Implemented dynamic position system with `position_to_index` mapping
  - Positions: 0=Year, 1=Month, 2=Day, 3=Hour, 4=10Y Luck, 5=Annual
  - Assigned luck_10_year to position 4 (adjacent to hour pillar at position 3)
  - Assigned yl (yearly luck) to position 5 (adjacent to 10-year luck at position 4)
  - Updated all helper functions (`get_branch_nodes()`, `get_stem_nodes()`) to use position mapping
  - Updated `pos_to_pillar` mappings to include both luck_10_year and yl
  - Changed interaction processing from checking `node.marked` to checking `node.interacted_with` list
  - This allows nodes to have multiple interactions (e.g., Hour Ding conflicts with both Day Gui AND Luck Gui)
- **Main Endpoint**: `/generate_natal_with_current_luck`
  - Generates natal chart (8 nodes)
  - Calculates current 10-year luck pillar based on age
  - Calculates current annual luck pillar for current year using `sxtwl`
  - Adds both as luck_10_year and yearly_luck positions
  - Calls `analyze_8_node_interactions()` with all 12 nodes
  - Returns unified response with:
    - All 12 nodes (hs_y through hs_yl, eb_y through eb_yl)
    - base_element_score and post_element_score (flat dicts with stem IDs as keys)
    - interactions dict (keyed by "TYPE~Pattern~nodes")
    - daymaster_analysis
    - current_luck_pillar_timing
    - annual_luck_pillar

**Frontend (Vue 3/Nuxt 3/TypeScript):**
- **Data Handling**:
  - Calls unified `/generate_natal_with_current_luck` endpoint
  - Extracts both 10-year and annual luck pillars from response
  - Constructs `currentLuckPillar` and `annualLuckPillar` ref objects
  - Updated element score computations to use new backend format (base_element_score/post_element_score)
- **Display Updates**:
  - Dynamic grid layouts: `:class="annualLuckPillar ? 'grid-cols-6' : currentLuckPillar ? 'grid-cols-5' : 'grid-cols-4'"`
  - **Purple border** styling for 10-year luck pillar (`border-2 border-purple-500`)
  - **Orange border** styling for annual luck pillar (`border-2 border-orange-500`)
  - Timing info display boxes for both luck pillars
  - Wu Xing energy flow arrows include all luck pillars
- **Interaction Features**:
  - `luckPillarInteractions` computed: Filters backend interactions by node IDs (hs_luck_10_year, eb_luck_10_year, hs_yl, eb_yl)
  - `getPillarInteractionData()`: Shows interactions in each pillar column using node ID matching
  - Hover highlighting: `highlightInteraction()` and `clearHighlight()` functions with blue ring visual effect
  - Interaction log: Updated `formatNodeName()`, `getPillarPosition()`, and `formatInteractionType()` to support both luck pillars
  - `getNodeIndex()`: Maps all 12 nodes to correct display positions (0-5)
- **Visual Enhancements**:
  - Highlighted nodes get `ring-4 ring-blue-500 ring-offset-2 shadow-xl scale-105 z-50` classes
  - Purple theme for 10-year luck, orange theme for annual luck
  - Color-coded interaction badges (green/red backgrounds)

**Design Principle**: KISS (Keep It Simple) - Reused existing pillar display components, minimal new code, progressive enhancement

### Visual Chart Layout

The BaZi chart displays in a **horizontal 6-column grid**:

```
┌─────────┬─────────┬─────────┬─────────┬──────────┬──────────┐
│  Hour   │   Day   │  Month  │  Year   │  10Y     │ Annual   │
│  時     │   日    │   月    │   年    │  運      │  年運    │
│         │   DM    │         │         │ (purple) │ (orange) │
├─────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│   HS    │   HS    │   HS    │   HS    │    HS    │    HS    │
│  Stem   │  Stem   │  Stem   │  Stem   │   Stem   │   Stem   │
├─────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│   EB    │   EB    │   EB    │   EB    │    EB    │    EB    │
│ Branch  │ Branch  │ Branch  │ Branch  │  Branch  │  Branch  │
└─────────┴─────────┴─────────┴─────────┴──────────┴──────────┘
   pos 0     pos 1     pos 2     pos 3      pos 4      pos 5
```

**Border Color Coding:**
- **Blue border** = Day pillar (Day Master / 日主)
- **Purple border** = 10-year luck pillar (大运)
- **Orange border** = Annual luck pillar (年運)
- Normal border = Standard natal pillars

**Interaction Display:**
- **Cross-pillar visibility**: Interactions show in ALL involved pillar columns
  - Example: Annual-Month interaction appears in BOTH Annual AND Month columns
- **Hover highlighting**: Hovering over any interaction card highlights ALL involved nodes with blue rings
- **Subtitle format**: Shows "with [Other Pillar Name]" to clarify relationships
- **Color coding**: Green background (positive), Red background (negative)

**Grid Behavior:**
- 4 columns: Natal chart only (Hour, Day, Month, Year)
- 5 columns: Natal + 10-year luck
- 6 columns: Natal + 10-year luck + annual luck

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
- **NO BaZi LOGIC**: Frontend must never calculate BaZi relationships, interactions, or transformations
- **Pure Display Layer**: Only map backend data to UI components
- **Dictionary Lookups Only**: Use backend-provided mappings for all labels (Ten Gods, elements, etc.)
- Use composable (`useBaziData`) for state management, not stores
- All backend calls proxy through `/api/bazi/*` to handle CORS
- TypeScript interfaces ensure type safety across data flow
- Natural language parsing handled via dedicated backend endpoint

**Backend:**
- **Source of Truth**: ALL BaZi knowledge, rules, and calculations live here
- **Complete Responses**: Backend calculates everything; frontend just displays
- KISS principle: Keep solutions simple for middle-school level understanding
- Avoid deeply nested JSON - keep structures flat (max 1 level deep)
- Always reference constants in `library.py` for consistency
- No test suite currently - consider adding pytest for critical calculations
- No linting configuration - consider adding ruff for code quality

**Adding New Features:**
1. **New BaZi Calculation**: Add to backend `app/` modules, expose via endpoint
2. **New Display**: Frontend calls endpoint, extracts data, renders UI
3. **Never Split Logic**: If backend doesn't provide it, add to backend first

**Example Feature Addition (Ten Gods Display):**
```
❌ WRONG Way:
- Frontend calculates Ten Gods from stem relationships
- Frontend has hardcoded mapping table

✅ CORRECT Way:
- Backend already provides mappings.ten_gods table
- Backend identifies Day Master in hs_d.base.id
- Frontend does lookup: mappings.ten_gods[dayMaster][stem]
- Frontend displays the abbreviation
```

### Backend Dependency
The frontend requires the Python backend API running on `http://localhost:8008` with endpoints:
- `/generate_natal_chart`: Main BaZi chart generation
- `/parse_input`: Natural language date/time parsing
- Additional analysis endpoints for various interaction patterns