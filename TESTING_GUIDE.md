# Testing Guide for /analyze-bazi Frontend Enhancement

## Prerequisites

1. **Backend Running**: Python FastAPI server on port 8008
   ```bash
   cd /Users/macbookair/GitHub/bazingse
   source .venv/bin/activate  # if using virtual environment
   python run_bazingse.py
   ```

2. **Frontend Running**: Nuxt dev server on port 3000
   ```bash
   cd /Users/macbookair/GitHub/bazingse-app
   npm run dev
   ```

3. **Browser**: Open http://localhost:3000

## Test Plan

### Test 1: Initial Load (Natal Chart Only)
**Steps**:
1. Load the page
2. Verify birth date/time/gender inputs are visible
3. Verify "Analyze Time Period" checkbox is visible but unchecked

**Expected Result**:
- ✅ 4 columns displayed (Hour, Day, Month, Year)
- ✅ Blue border on Day pillar (Day Master)
- ✅ Chart displays correctly with all natal data
- ✅ No analysis period info panel visible

---

### Test 2: Enable Analysis Mode
**Steps**:
1. Check "🔮 Analyze Time Period (Time Travel)" checkbox
2. Observe the UI changes

**Expected Result**:
- ✅ Analysis period inputs appear (4 columns: Year, Month, Day, Time)
- ✅ Year input is enabled and pre-filled with current year (2025)
- ✅ Month, Day, Time inputs are disabled (grayed out)
- ✅ "Clear" button appears
- ✅ Helpful tip text appears at bottom
- ✅ Chart regenerates automatically with current year

---

### Test 3: Add Analysis Year
**Steps**:
1. Ensure analysis mode is enabled
2. Change year to 2024
3. Wait for chart to regenerate (500ms debounce)

**Expected Result**:
- ✅ Chart regenerates with 6 columns
- ✅ Two new pillars appear:
  - 5th pillar: "10Y Luck 運" with purple border
  - 6th pillar: "Annual 年運" with orange border
- ✅ Analysis info panel appears showing:
  - Year: 2024
  - Purple pill: "10-Year Luck"
  - Orange pill: "Annual"
- ✅ Month input becomes enabled (white background)

---

### Test 4: Add Analysis Month
**Steps**:
1. Enter month: 11
2. Wait for chart to regenerate

**Expected Result**:
- ✅ Chart regenerates with 7 columns
- ✅ New pillar appears:
  - 7th pillar: "Monthly 月運" with green border
- ✅ Analysis info panel updates:
  - Month: 11 appears
  - Green pill: "Monthly" appears
- ✅ Day input becomes enabled

---

### Test 5: Add Analysis Day
**Steps**:
1. Enter day: 25
2. Wait for chart to regenerate

**Expected Result**:
- ✅ Chart regenerates with 8 columns
- ✅ New pillar appears:
  - 8th pillar: "Daily 日運" with indigo border
- ✅ Analysis info panel updates:
  - Day: 25 appears
  - Indigo pill: "Daily" appears
- ✅ Time input becomes enabled

---

### Test 6: Add Analysis Time
**Steps**:
1. Enter time: 14:30
2. Wait for chart to regenerate

**Expected Result**:
- ✅ Chart regenerates with 9 columns (maximum)
- ✅ New pillar appears:
  - 9th pillar: "Hourly 時運" with pink border
- ✅ Analysis info panel updates:
  - Time: 14:30 appears
  - Pink pill: "Hourly" appears
- ✅ All 9 pillars visible with proper spacing

---

### Test 7: Clear Analysis Period
**Steps**:
1. Click "Clear" button (top right of analysis controls)

**Expected Result**:
- ✅ All analysis inputs reset to empty/null
- ✅ Chart regenerates with 4 columns (natal only)
- ✅ Analysis info panel disappears
- ✅ 10-year luck timing panel disappears
- ✅ Back to original state

---

### Test 8: Toggle Analysis Mode Off
**Steps**:
1. Enable analysis mode with year 2024
2. Uncheck "Analyze Time Period" checkbox

**Expected Result**:
- ✅ Analysis controls collapse
- ✅ Chart regenerates with 4 columns (natal only)
- ✅ Analysis info panel disappears
- ✅ Analysis parameters are retained (if checkbox is re-enabled, they reappear)

---

### Test 9: Progressive Disclosure Validation
**Steps**:
1. Enable analysis mode
2. Try to enter month without year (should be disabled)
3. Enter year, verify month becomes enabled
4. Try to enter day without month (should be disabled)
5. Enter month, verify day becomes enabled
6. Try to enter time without day (should be disabled)
7. Enter day, verify time becomes enabled

**Expected Result**:
- ✅ Inputs are properly disabled/enabled based on dependencies
- ✅ Disabled inputs have gray background
- ✅ Enabled inputs have white background
- ✅ Cursor changes to "not-allowed" on disabled inputs

---

### Test 10: Interactions Display
**Steps**:
1. Enable analysis mode with year 2024, month 11
2. Open trace log panel (right side)
3. Scroll through interactions

**Expected Result**:
- ✅ Interactions include nodes from all visible pillars
- ✅ Node names are correctly formatted:
  - "Year Stem", "Year Branch"
  - "10-Year Luck Stem", "10-Year Luck Branch"
  - "Annual Luck Stem", "Annual Luck Branch"
  - "Monthly Luck Stem", "Monthly Luck Branch"
- ✅ Hover over interaction highlights correct pillars
- ✅ Position indicators show correct pillar names

---

### Test 11: Border Color Visual Test
**Steps**:
1. Enable analysis with all parameters
2. Observe all 9 pillars

**Expected Border Colors**:
- ✅ Column 1 (Hour): Gray border (normal)
- ✅ Column 2 (Day): Blue border (Day Master)
- ✅ Column 3 (Month): Gray border (normal)
- ✅ Column 4 (Year): Gray border (normal)
- ✅ Column 5 (10Y Luck): Purple border
- ✅ Column 6 (Annual): Orange border
- ✅ Column 7 (Monthly): Green border
- ✅ Column 8 (Daily): Indigo border
- ✅ Column 9 (Hourly): Pink border

---

### Test 12: Element Transformation View
**Steps**:
1. Set up chart with analysis period
2. Toggle between "Base" and "Post Interaction" views
3. Verify interactions show for all pillars

**Expected Result**:
- ✅ Base view: No interactions, no WuXing flow arrows
- ✅ Post view: Interactions visible, WuXing flow arrows between all pillars
- ✅ Transformation badges appear on affected nodes
- ✅ Energy flow arrows connect across all 9 columns

---

### Test 13: Element Scores Panel
**Steps**:
1. Scroll down to "Elemental Energy Transformation" section
2. Toggle between Before/Combined/After views

**Expected Result**:
- ✅ All three views display correctly
- ✅ Scores update based on all active pillars (including analysis pillars)
- ✅ Chart animations work smoothly
- ✅ Percentages sum correctly

---

### Test 14: Analysis Info Panel Details
**Steps**:
1. Enable analysis with year 2024, month 11, day 25, time 14:30
2. Observe analysis info panel

**Expected Result**:
- ✅ Title: "📅 Analysis Period"
- ✅ Grid shows:
  - Year: 2024
  - Month: 11
  - Day: 25
  - Time: 14:30
- ✅ 5 pill badges displayed:
  - Purple: "10-Year Luck"
  - Orange: "Annual"
  - Green: "Monthly"
  - Indigo: "Daily"
  - Pink: "Hourly"
- ✅ Panel has indigo/purple gradient background

---

### Test 15: Responsiveness
**Steps**:
1. Resize browser window
2. Test on different screen sizes

**Expected Result**:
- ✅ Desktop (>1280px): All 9 columns fit comfortably
- ✅ Laptop (1024px): 9 columns may be tight but usable
- ✅ Tablet (768px): Horizontal scroll may be needed for 9 columns (acceptable)
- ✅ Mobile (<640px): Horizontal scroll needed for >4 columns (acceptable)

---

### Test 16: Edge Cases
**Steps**:
1. **Invalid Date**: Enter February 30 (backend should handle)
2. **Future Date**: Enter year 2030 (should work)
3. **Past Date**: Enter year 1950 (should work)
4. **Unknown Hour**: Check unknown hour, enable analysis (should work)

**Expected Result**:
- ✅ Backend validation handles invalid dates
- ✅ Future/past dates work correctly
- ✅ Unknown hour doesn't break analysis mode

---

### Test 17: Performance
**Steps**:
1. Enable analysis with all parameters
2. Observe chart generation time
3. Toggle between views
4. Open interaction log with many interactions

**Expected Result**:
- ✅ Chart generation: <300ms
- ✅ View toggle: <100ms (smooth)
- ✅ Interaction log renders: <200ms
- ✅ No lag or freezing
- ✅ Smooth animations

---

### Test 18: Console Errors
**Steps**:
1. Open browser dev tools console
2. Perform all above tests
3. Monitor for errors

**Expected Result**:
- ✅ No JavaScript errors
- ✅ No warnings about missing data
- ✅ API calls succeed (status 200)
- ✅ Console logs show correct data structures

---

## Manual Testing Checklist

Copy this checklist and check off as you test:

- [ ] Test 1: Initial Load
- [ ] Test 2: Enable Analysis Mode
- [ ] Test 3: Add Analysis Year
- [ ] Test 4: Add Analysis Month
- [ ] Test 5: Add Analysis Day
- [ ] Test 6: Add Analysis Time
- [ ] Test 7: Clear Analysis Period
- [ ] Test 8: Toggle Analysis Mode Off
- [ ] Test 9: Progressive Disclosure
- [ ] Test 10: Interactions Display
- [ ] Test 11: Border Colors
- [ ] Test 12: Element Transformation View
- [ ] Test 13: Element Scores Panel
- [ ] Test 14: Analysis Info Panel
- [ ] Test 15: Responsiveness
- [ ] Test 16: Edge Cases
- [ ] Test 17: Performance
- [ ] Test 18: Console Errors

## Automated Testing (Future)

Consider adding:
- Unit tests for pillar extraction logic
- Integration tests for API calls
- E2E tests using Playwright or Cypress
- Visual regression tests for UI components

## Known Limitations

1. **Mobile 9-Column View**: Requires horizontal scroll (acceptable UX trade-off)
2. **Date Validation**: Relies on backend (frontend doesn't validate dates)
3. **Timezone**: Uses local timezone (may need clarification for international users)

## Reporting Issues

If you find any issues, please report with:
1. Browser and version
2. Screen size
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots if applicable
6. Console errors if any

## Success Criteria

All tests pass ✅ = Implementation is successful and ready for production use.
