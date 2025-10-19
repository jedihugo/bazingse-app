# Frontend Enhancement Plan for /analyze-bazi Integration

## Overview
Integrate the new `/analyze-bazi` backend endpoint into the frontend to enable time period analysis with progressive pillar generation.

## Current State Analysis

### Current Implementation:
- **Endpoint**: `/api/bazi/generate_natal_with_current_luck`
- **Pillars Shown**: 4 natal + 10-year luck + annual (max 6 columns)
- **Time Period**: Always current year (hardcoded)
- **Parameters**: birth_date, birth_time, gender

### New Endpoint Capabilities:
- **Endpoint**: `/analyze-bazi`
- **Progressive Generation**:
  - Base: 4 natal pillars (8 nodes)
  - +analysis_year: +10-year luck + annual (12 nodes, 6 pillars)
  - +analysis_month: +monthly (14 nodes, 7 pillars)
  - +analysis_day: +daily (16 nodes, 8 pillars)
  - +analysis_time: +hourly (18 nodes, 9 pillars)
- **Parameters**: birth_date, birth_time, gender, analysis_year, analysis_month, analysis_day, analysis_time

## Implementation Steps

### Step 1: Add Analysis Period State Variables
**File**: `pages/index.vue`
**Location**: Script section with other ref() declarations

Add:
```javascript
// Analysis period controls
const analysisYear = ref(null)
const analysisMonth = ref(null) 
const analysisDay = ref(null)
const analysisTime = ref('')
const showAnalysisPeriod = ref(false) // Toggle for analysis mode
```

### Step 2: Add Analysis Period UI Controls
**File**: `pages/index.vue`
**Location**: After birth date inputs, before chart display

Add collapsible panel with:
- Checkbox: "Analyze Time Period" (toggles showAnalysisPeriod)
- When checked, show:
  - Year input (4-digit, 1900-2100)
  - Month input (1-12, only if year set)
  - Day input (1-31, only if month set)
  - Time input (HH:MM, only if day set)
- "Clear Analysis" button to reset to natal-only

UI Structure:
```vue
<!-- Analysis Period Controls -->
<div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
  <div class="flex items-center gap-2 mb-3">
    <input type="checkbox" v-model="showAnalysisPeriod" id="analysis-toggle" class="..."/>
    <label for="analysis-toggle" class="text-sm font-medium">Analyze Time Period</label>
  </div>
  
  <div v-if="showAnalysisPeriod" class="grid grid-cols-4 gap-3">
    <!-- Year, Month, Day, Time inputs with progressive disclosure -->
  </div>
</div>
```

### Step 3: Update API Call
**File**: `pages/index.vue`
**Function**: `generateChart()` (line 1875)

Current:
```javascript
let apiUrl = `/api/bazi/generate_natal_with_current_luck?birth_date=${birthDate.value}&birth_time=${timeParam}&gender=${gender.value}`
```

New:
```javascript
let apiUrl = `/api/bazi/analyze-bazi?birth_date=${birthDate.value}&birth_time=${timeParam}&gender=${gender.value}`

// Add analysis parameters if set
if (analysisYear.value) {
  apiUrl += `&analysis_year=${analysisYear.value}`
  if (analysisMonth.value) {
    apiUrl += `&analysis_month=${analysisMonth.value}`
    if (analysisDay.value) {
      apiUrl += `&analysis_day=${analysisDay.value}`
      if (analysisTime.value) {
        apiUrl += `&analysis_time=${analysisTime.value}`
      }
    }
  }
}
```

### Step 4: Create New Proxy Endpoint
**File**: `server/api/bazi/analyze-bazi.get.ts` (NEW FILE)

```typescript
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Build API URL with all parameters
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value) params.append(key, String(value))
  }
  
  const apiUrl = `http://localhost:8008/analyze-bazi?${params.toString()}`
  
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `API returned ${response.status}`
    })
  }
  
  return await response.json()
})
```

### Step 5: Extract Monthly/Daily/Hourly Pillars
**File**: `pages/index.vue`
**Function**: `pillarsOrdered` computed property (line 1524)

Currently extracts:
- 4 natal pillars
- 10-year luck (hs_luck_10_year, eb_luck_10_year)
- Annual (hs_yl, eb_yl)

Need to add:
- Monthly (hs_ml, eb_ml)
- Daily (hs_dl, eb_dl)
- Hourly (hs_hl, eb_hl)

Logic pattern (same as annual):
```javascript
// Monthly pillar
if (chartData.value?.hs_ml && chartData.value?.eb_ml) {
  const [hsName, ebName] = [
    chartData.value.hs_ml.base?.id,
    chartData.value.eb_ml.base?.id
  ]
  // Build pillar object with label: 'Monthly 月運'
  // Add to pillarsOrdered array
}

// Repeat for daily (hs_dl/eb_dl) and hourly (hs_hl/eb_hl)
```

### Step 6: Dynamic Grid Layout
**File**: `pages/index.vue`
**Locations**: Multiple grid class bindings

Current:
```vue
:class="luckPillarCount === 2 ? 'grid-cols-6' : luckPillarCount === 1 ? 'grid-cols-5' : 'grid-cols-4'"
```

New:
```vue
:class="`grid-cols-${totalPillarCount}`"
```

Add computed:
```javascript
const totalPillarCount = computed(() => {
  let count = 4  // Base natal pillars
  if (chartData.value?.analysis_info) {
    if (chartData.value.analysis_info.has_luck_pillar) count++
    if (chartData.value.analysis_info.has_annual) count++
    if (chartData.value.analysis_info.has_monthly) count++
    if (chartData.value.analysis_info.has_daily) count++
    if (chartData.value.analysis_info.has_hourly) count++
  }
  return count
})
```

Update all grid class bindings (5 locations):
- Heavenly Stems Row (line 151)
- Vertical Flow Row (line 205)
- Earthly Branches Row (line 218)
- Interaction Labels Row (line 331)

### Step 7: Add Border Styling for New Pillar Types
**File**: `pages/index.vue`
**Locations**: Pillar border class bindings in stem/branch rendering

Current special styling:
- index === 1: Blue border (day master)
- index === 3 (10-year luck): Purple border  
- index === 4 (annual): Orange border

Add:
- Monthly: Green border (`border-2 border-green-500`)
- Daily: Indigo border (`border-2 border-indigo-500`)
- Hourly: Pink border (`border-2 border-pink-500`)

Update `:class` bindings:
```vue
:class="[
  hoveredNode === `stem-${index}` ? 'shadow-lg scale-105' : 'border border-gray-300',
  highlightedNodes.includes(`stem-${index}`) ? 'ring-4 ring-blue-500 ring-offset-2 shadow-xl scale-105 z-50' : '',
  index === 1 ? 'border-2 border-blue-500' : '',  // Day master
  pillar.is10YearLuck ? 'border-2 border-purple-500' : '',
  pillar.isAnnualLuck ? 'border-2 border-orange-500' : '',
  pillar.isMonthlyLuck ? 'border-2 border-green-500' : '',
  pillar.isDailyLuck ? 'border-2 border-indigo-500' : '',
  pillar.isHourlyLuck ? 'border-2 border-pink-500' : '',
  pillar.isUnknown ? 'bg-gray-100 border-dashed opacity-60' : ''
]"
```

### Step 8: Add Analysis Info Display Panel
**File**: `pages/index.vue`
**Location**: After Day Master Analysis section

Add:
```vue
<!-- Analysis Period Info -->
<div v-if="chartData?.analysis_info?.has_luck_pillar" class="mt-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
  <div class="text-sm font-semibold text-indigo-900 mb-2">Analysis Period</div>
  <div class="text-sm">
    <span class="font-medium">Year:</span> {{ chartData.analysis_info.year || 'Not set' }}
  </div>
  <div v-if="chartData.analysis_info.month" class="text-sm">
    <span class="font-medium">Month:</span> {{ chartData.analysis_info.month }}
  </div>
  <div v-if="chartData.analysis_info.day" class="text-sm">
    <span class="font-medium">Day:</span> {{ chartData.analysis_info.day }}
  </div>
  <div v-if="chartData.analysis_info.time" class="text-sm">
    <span class="font-medium">Time:</span> {{ chartData.analysis_info.time }}
  </div>
</div>
```

### Step 9: Update Luck Pillar Labels
**File**: `pages/index.vue`  
**Locations**: In pillar object construction

Update labels for clarity:
- 10-year luck: "10Y Luck 運" (keep current)
- Annual: "Annual 年運" (keep current)
- Monthly: "Monthly 月運" (NEW)
- Daily: "Daily 日運" (NEW)
- Hourly: "Hourly 時運" (NEW)

### Step 10: Update Interaction Logic
**File**: `pages/index.vue`
**Functions**: `getPillarInteractionData()`, `formatNodeName()`, `getPillarPosition()`

Update node ID mappings to include:
- `hs_ml`, `eb_ml` → Monthly pillar
- `hs_dl`, `eb_dl` → Daily pillar
- `hs_hl`, `eb_hl` → Hourly pillar

Update position mappings:
```javascript
const positionMap = {
  // Natal
  'hs_h': 'Hour', 'eb_h': 'Hour',
  'hs_d': 'Day', 'eb_d': 'Day',
  'hs_m': 'Month', 'eb_m': 'Month',
  'hs_y': 'Year', 'eb_y': 'Year',
  // Luck
  'hs_luck_10_year': '10Y', 'eb_luck_10_year': '10Y',
  'hs_yl': 'Annual', 'eb_yl': 'Annual',
  'hs_ml': 'Monthly', 'eb_ml': 'Monthly',
  'hs_dl': 'Daily', 'eb_dl': 'Daily',
  'hs_hl': 'Hourly', 'eb_hl': 'Hourly'
}
```

## Testing Scenarios

1. **Natal Only**: No analysis period → 4 columns
2. **+Year**: analysis_year=2024 → 6 columns (10Y + Annual)
3. **+Month**: +analysis_month=11 → 7 columns (+Monthly)
4. **+Day**: +analysis_day=25 → 8 columns (+Daily)
5. **+Time**: +analysis_time=14:30 → 9 columns (+Hourly)
6. **Interactions**: Verify all interactions show correctly across all pillar types
7. **Border Colors**: Verify each pillar type has correct border color
8. **Analysis Info**: Verify info panel shows correct details

## Edge Cases

1. **Unknown Birth Hour**: Should still work for natal chart
2. **Invalid Analysis Date**: Backend validation
3. **Missing Intermediate Values**: Backend uses defaults (Feb 15, etc.)
4. **Switching Modes**: Clear analysis period when toggling off

## Files to Modify

1. ✅ `pages/index.vue` - Main changes
2. ✅ `server/api/bazi/analyze-bazi.get.ts` - New proxy endpoint
3. ❌ `composables/useBaziData.ts` - No changes needed (not used in current flow)
4. ❌ `types/bazi.ts` - No changes needed (response structure compatible)

## Backward Compatibility

- Existing functionality preserved
- Analysis mode is opt-in via checkbox
- Default behavior: show natal chart only (like before)
- Old endpoint still works if needed

## Performance Considerations

- Backend response time: ~50-200ms depending on node count
- Frontend rendering: No performance impact (same rendering logic)
- Debounce analysis period inputs to avoid excessive API calls

## UI/UX Improvements

1. **Progressive Disclosure**: Show only relevant controls based on previous selections
2. **Default to Current**: Pre-fill analysis year with current year for convenience
3. **Clear Feedback**: Show loading state during API calls
4. **Visual Hierarchy**: Use borders to clearly distinguish pillar types
5. **Responsive**: Grid should adapt gracefully (may need horizontal scroll on mobile for 9 columns)

## Implementation Order

1. ✅ Create plan document (this file)
2. → Create new proxy endpoint
3. → Add analysis period state and UI controls  
4. → Update generateChart() API call
5. → Extract monthly/daily/hourly pillars
6. → Update grid layout to be dynamic
7. → Add border styling for new pillars
8. → Add analysis info display panel
9. → Update interaction logic
10. → Test all scenarios
11. → Self-critique and refine

## Acceptance Criteria

- ✅ Can view natal chart only (default)
- ✅ Can analyze specific year (shows 10Y + annual)
- ✅ Can drill down to month level
- ✅ Can drill down to day level
- ✅ Can drill down to hour level
- ✅ All interactions calculated and displayed correctly
- ✅ Each pillar type has distinct border color
- ✅ Grid layout adapts dynamically (4-9 columns)
- ✅ Analysis info panel shows current analysis period
- ✅ No regressions in existing functionality

## Risk Mitigation

- Keep changes localized to single file where possible
- Test incrementally after each step
- Maintain backward compatibility
- Clear commit messages for easy rollback if needed
