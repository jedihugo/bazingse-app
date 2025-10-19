<template>
  <div class="min-h-screen bg-gray-50">
    
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <img 
          src="/bazingse-logo.png" 
          alt="BaZingSe Logo" 
          class="w-12 h-12 object-contain"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            BaZingSe
          </h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto px-4 py-8">
      <!-- Flex Container: Chart (left) + Trace Panel (right) -->
      <div class="flex gap-4 relative">
        <!-- Left: BaZi Chart Section (flexible) -->
        <div class="flex-1 min-w-0" :class="showInteractionLog ? 'max-w-[calc(100%-450px)]' : 'max-w-7xl mx-auto'">
          <!-- BaZi Chart with Integrated Input -->
          <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Chart Grid with Input Fields -->
        <div class="w-full">
          <!-- Controls Row: Gender + Time Travel aligned with columns -->
          <div class="flex gap-1 mb-2 overflow-x-auto">
            <!-- Spacer for Hour column -->
            <div class="w-28 flex-shrink-0"></div>
            
            <!-- Gender in Day column position -->
            <div class="w-28 flex-shrink-0">
              <div class="flex justify-center gap-3">
                <label class="cursor-pointer flex items-center gap-0.5">
                  <input
                    type="radio"
                    v-model="gender"
                    value="male"
                    class="w-3 h-3 text-blue-600 focus:ring-blue-500"
                    @change="handleInputChange"
                  />
                  <span class="text-sm">♂</span>
                </label>
                <label class="cursor-pointer flex items-center gap-0.5">
                  <input
                    type="radio"
                    v-model="gender"
                    value="female"
                    class="w-3 h-3 text-pink-600 focus:ring-pink-500"
                    @change="handleInputChange"
                  />
                  <span class="text-sm">♀</span>
                </label>
              </div>
            </div>
            
            <!-- Spacers for Month and Year columns -->
            <div class="w-28 flex-shrink-0"></div>
            <div class="w-28 flex-shrink-0"></div>
            
            <!-- Time Travel checkbox (always visible) -->
            <div class="w-28 flex-shrink-0">
              <div class="flex justify-center">
                <label class="cursor-pointer flex items-center gap-1">
                  <input 
                    type="checkbox" 
                    v-model="showAnalysisPeriod" 
                    class="w-3 h-3 text-indigo-600 rounded focus:ring-indigo-500"
                    @change="handleAnalysisModeToggle"
                  />
                  <span class="text-xs font-medium text-indigo-700">🔮</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Column Headers: Each input aligned with pillar below (9 columns max) -->
          <div class="flex gap-1 mb-2 overflow-x-auto items-center">
            
            <!-- Column 1: Hour (Natal) -->
            <div class="w-28 flex-shrink-0">
              <label class="block text-[10px] font-semibold text-gray-700 mb-1 text-center">時 Hour</label>
              <div class="relative">
                <input
                  v-if="!unknownHour"
                  v-model="birthTime"
                  type="time"
                  class="w-full pl-1 pr-6 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center hour-input-no-icon"
                  @change="handleInputChange"
                />
                <input
                  v-else
                  value="?"
                  disabled
                  class="w-full px-1 py-1.5 text-xs border border-gray-300 rounded bg-gray-100 text-center text-gray-500"
                />
                <button
                  @click="unknownHour = !unknownHour; handleUnknownHourChange()"
                  :class="[
                    'absolute right-0.5 top-1/2 -translate-y-1/2 px-1 py-0.5 text-[10px] border rounded transition-colors',
                    unknownHour 
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-600 border-gray-300'
                  ]"
                  title="Toggle unknown hour"
                >
                  ?
                </button>
              </div>
            </div>
            
            <!-- Column 2: Day (Natal) -->
            <div class="w-28 flex-shrink-0">
              <label class="block text-[10px] font-semibold text-gray-700 mb-1 text-center">日 Day</label>
              <input
                v-model="dayInput"
                type="number"
                min="1"
                max="31"
                placeholder="DD"
                class="w-full px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                @change="handleInputChange"
              />
            </div>
            
            <!-- Column 3: Month (Natal) -->
            <div class="w-28 flex-shrink-0">
              <label class="block text-[10px] font-semibold text-gray-700 mb-1 text-center">月 Month</label>
              <input
                v-model="monthInput"
                type="number"
                min="1"
                max="12"
                placeholder="MM"
                class="w-full px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                @change="handleInputChange"
              />
            </div>
            
            <!-- Column 4: Year (Natal) -->
            <div class="w-28 flex-shrink-0">
              <label class="block text-[10px] font-semibold text-gray-700 mb-1 text-center">年 Year</label>
              <input
                v-model="yearInput"
                type="number"
                min="1900"
                max="2100"
                placeholder="YYYY"
                class="w-full px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                @change="handleInputChange"
              />
            </div>
            
            <!-- Left Partition Divider (before 10Y Luck) -->
            <div v-if="chartData?.analysis_info?.has_luck_pillar" 
                 class="relative flex-shrink-0 mx-3 self-stretch" 
                 style="width: 2px; min-height: 60px;">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-70"></div>
            </div>
            
            <!-- Column 5: 10-Year Luck (Label) -->
            <div v-if="chartData?.analysis_info?.has_luck_pillar" class="w-28 flex-shrink-0">
              <label class="block text-[10px] font-semibold text-purple-700 mb-1 text-center">運 10Y Luck</label>
              <div class="px-1 py-1.5 text-xs bg-purple-50 border border-purple-300 rounded text-center">
                <div class="text-[10px] font-bold text-purple-700 leading-tight">
                  {{ currentLuckPillar?.timing?.start_year || '?' }} - {{ currentLuckPillar?.timing?.end_year || '?' }}
                </div>
              </div>
            </div>
            
            <!-- Right Partition Divider (after 10Y Luck) -->
            <div v-if="chartData?.analysis_info?.has_luck_pillar" 
                 class="relative flex-shrink-0 mx-3 self-stretch" 
                 style="width: 2px; min-height: 60px;">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-70"></div>
            </div>
            
            <!-- Column 6: Annual (Analysis Year) - Always show when time travel mode is ON -->
            <div v-if="showAnalysisPeriod" class="w-28 flex-shrink-0">
              <div class="flex items-center justify-center gap-1 mb-1">
                <input 
                  type="checkbox" 
                  v-model="includeAnnualLuck" 
                  class="w-2.5 h-2.5 rounded cursor-pointer"
                  style="accent-color: #C9B037;"
                  @change="handleInputChange"
                  title="Include Annual Luck in calculations"
                />
                <label class="text-[10px] font-semibold text-center cursor-pointer" 
                       :style="includeAnnualLuck ? 'color: #8B7355;' : 'color: #9CA3AF;'"
                       @click="includeAnnualLuck = !includeAnnualLuck; handleInputChange()"
                       title="Click to toggle Annual Luck inclusion">
                  年運 Annual
                </label>
              </div>
              <input
                v-model.number="analysisYear"
                type="number"
                min="1900"
                max="2100"
                placeholder="YYYY"
                :class="includeAnnualLuck 
                  ? 'w-full px-1 py-1.5 text-xs border rounded focus:outline-none text-center'
                  : 'w-full px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-center bg-gray-50 opacity-60'"
                :style="includeAnnualLuck ? 'background: #F5F1E8; border-color: #C9B037; color: #8B7355;' : ''"
                @change="handleInputChange"
              />
            </div>
            
            <!-- Column 7: Monthly (Analysis Month) - Only show if Annual is enabled -->
            <div v-if="showAnalysisPeriod && analysisYear && includeAnnualLuck" class="w-28 flex-shrink-0">
              <div class="flex items-center justify-center gap-1 mb-1">
                <input 
                  type="checkbox" 
                  v-model="includeMonthlyLuck" 
                  class="w-2.5 h-2.5 rounded cursor-pointer"
                  style="accent-color: #C9B037;"
                  @change="handleInputChange"
                  title="Include Monthly Luck in calculations"
                />
                <label class="text-[10px] font-semibold text-center cursor-pointer" 
                       :style="includeMonthlyLuck ? 'color: #8B7355;' : 'color: #9CA3AF;'"
                       @click="includeMonthlyLuck = !includeMonthlyLuck; handleInputChange()"
                       title="Click to toggle Monthly Luck inclusion">
                  月運 Monthly
                </label>
              </div>
              <input
                v-model.number="analysisMonth"
                type="number"
                min="1"
                max="12"
                placeholder="MM"
                :class="includeMonthlyLuck 
                  ? 'w-full px-1 py-1.5 text-xs border rounded focus:outline-none text-center'
                  : 'w-full px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-center bg-gray-50 opacity-60'"
                :style="includeMonthlyLuck ? 'background: #F5F1E8; border-color: #C9B037; color: #8B7355;' : ''"
                @change="handleInputChange"
              />
            </div>
            
            <!-- Column 8: Daily (Analysis Day) - Only show if Monthly is enabled -->
            <div v-if="showAnalysisPeriod && analysisMonth && includeMonthlyLuck" class="w-28 flex-shrink-0">
              <div class="flex items-center justify-center gap-1 mb-1">
                <input 
                  type="checkbox" 
                  v-model="includeDailyLuck" 
                  class="w-2.5 h-2.5 rounded cursor-pointer"
                  style="accent-color: #C9B037;"
                  @change="handleInputChange"
                  title="Include Daily Luck in calculations"
                />
                <label class="text-[10px] font-semibold text-center cursor-pointer" 
                       :style="includeDailyLuck ? 'color: #8B7355;' : 'color: #9CA3AF;'"
                       @click="includeDailyLuck = !includeDailyLuck; handleInputChange()"
                       title="Click to toggle Daily Luck inclusion">
                  日運 Daily
                </label>
              </div>
              <input
                v-model.number="analysisDay"
                type="number"
                min="1"
                max="31"
                placeholder="DD"
                :class="includeDailyLuck 
                  ? 'w-full px-1 py-1.5 text-xs border rounded focus:outline-none text-center'
                  : 'w-full px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-center bg-gray-50 opacity-60'"
                :style="includeDailyLuck ? 'background: #F5F1E8; border-color: #C9B037; color: #8B7355;' : ''"
                @change="handleInputChange"
              />
            </div>
            
            <!-- Column 9: Hourly (Analysis Time) - Only show if Daily is enabled -->
            <div v-if="showAnalysisPeriod && analysisDay && includeDailyLuck" class="w-28 flex-shrink-0">
              <div class="flex items-center justify-center gap-1 mb-1">
                <input 
                  type="checkbox" 
                  v-model="includeHourlyLuck" 
                  class="w-2.5 h-2.5 rounded cursor-pointer"
                  style="accent-color: #C9B037;"
                  @change="handleInputChange"
                  title="Include Hourly Luck in calculations"
                />
                <label class="text-[10px] font-semibold text-center cursor-pointer" 
                       :style="includeHourlyLuck ? 'color: #8B7355;' : 'color: #9CA3AF;'"
                       @click="includeHourlyLuck = !includeHourlyLuck; handleInputChange()"
                       title="Click to toggle Hourly Luck inclusion">
                  時運 Hourly
                </label>
              </div>
              <input
                v-model="analysisTime"
                type="time"
                placeholder="HH:MM"
                :class="includeHourlyLuck 
                  ? 'w-full px-1 py-1.5 text-xs border rounded focus:outline-none text-center'
                  : 'w-full px-1 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-center bg-gray-50 opacity-60'"
                :style="includeHourlyLuck ? 'background: #F5F1E8; border-color: #C9B037; color: #8B7355;' : ''"
                @change="handleInputChange"
              />
            </div>
            

            
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="text-center py-4">
            <div class="inline-flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-600">Calculating...</span>
            </div>
          </div>

          <!-- BaZi Chart Display -->
          <div v-if="pillarsOrdered && !isLoading" class="relative">
            <!-- Traditional 6-Column Grid (4 natal + 2 luck pillars) -->
            <div class="relative overflow-x-auto" :class="totalPillarCount > 4 ? 'max-w-full' : 'max-w-lg'">
              
              <!-- Heavenly Stems Row -->
              <div class="flex gap-1 items-center">
                <!-- Natal Pillars (0-3) -->
                <template v-for="(pillar, index) in pillarsOrdered" :key="`stem-${index}`">
                  <!-- Left Partition: Before 10-year luck pillar (position 4) -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="relative flex-shrink-0 mx-3 self-stretch"
                       style="width: 2px;">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-70"></div>
                  </div>
                  
                  <!-- Pillar Content -->
                <div class="relative w-28 flex-shrink-0">
                  <div 
                    :id="`stem-${index}`"
                    class="aspect-square p-3 rounded transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-center"
                    :class="[
                      hoveredNode === `stem-${index}` ? 'shadow-lg scale-105' : 'border border-gray-300',
                      highlightedNodes.includes(`stem-${index}`) ? 'ring-4 ring-blue-500 ring-offset-2 shadow-xl scale-105 z-50' : '',
                      index === 1 ? 'border-2 border-blue-500' : '',
                      pillar.is10YearLuck ? 'border-2 border-purple-500' : '',
                      pillar.isAnnualLuck && !includeAnnualLuck ? 'opacity-40 grayscale' : '',
                      pillar.isMonthlyLuck && !includeMonthlyLuck ? 'opacity-40 grayscale' : '',
                      pillar.isDailyLuck && !includeDailyLuck ? 'opacity-40 grayscale' : '',
                      pillar.isHourlyLuck && !includeHourlyLuck ? 'opacity-40 grayscale' : '',
                      pillar.isUnknown ? 'bg-gray-100 border-dashed opacity-60' : ''
                    ]"
                    :style="pillar.isUnknown ? {} : getNodeBgColor(pillar.stem.element, pillar.stem.color)"
                  >
                    <!-- Transformation Badge (top-right corner) -->
                    <div v-if="pillar.stemTransformBadge" 
                         class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-full shadow-md transform hover:scale-110 transition-transform"
                         :style="getTransformBadgeStyle(pillar.stemTransformBadge)">
                      {{ getTransformBadgeDisplay(pillar.stemTransformBadge) }}
                    </div>
                    
                    <!-- Pinyin name at top -->
                    <div v-if="!pillar.isUnknown" class="text-xs text-gray-700 mb-1">{{ pillar.stemName }}</div>
                    <!-- Chinese character (always show original from base) -->
                    <div class="text-2xl font-bold text-black">
                      {{ pillar.stem.chinese }}
                    </div>
                    <!-- Element type -->
                    <div v-if="!pillar.isUnknown" class="text-xs text-gray-700">
                      <template v-if="showTransformed && pillar.stem.transformedElement">
                        {{ pillar.stem.transformedElement.replace('Yang ', '').replace('Yin ', '') }}
                      </template>
                      <template v-else>
                        {{ pillar.stem.element.replace('Yang ', '').replace('Yin ', '') }} {{ pillar.stem.element.includes('Yang') ? '+' : '-' }}
                      </template>
                    </div>
                    <!-- Ten God or Day Master -->
                    <div v-if="!pillar.isUnknown" class="text-xs mt-1 text-gray-900">
                      {{ index === 1 ? 'Day master' : (pillar.tenGod || '') }}
                    </div>
                    
                    
                    
                    <!-- Horizontal WuXing Flow to Next Stem (only in post/transformed view) -->
                    <div v-if="viewMode !== 'base' && !pillar.isUnknown && index < pillarsOrdered.length - 1 && !pillarsOrdered[index + 1].isUnknown && getWuXingRelation(pillar.stem.element, pillarsOrdered[index + 1].stem.element)"
                         class="absolute -right-3 top-1/2 -translate-y-1/2 text-lg font-bold z-30"
                         :class="getWuXingRelationClass(pillar.stem.element, pillarsOrdered[index + 1].stem.element)"
                         :title="`${pillar.stem.element} to ${pillarsOrdered[index + 1].stem.element}`">
                      {{ getWuXingRelation(pillar.stem.element, pillarsOrdered[index + 1].stem.element) }}
                    </div>
                  </div>
                </div>
                
                  <!-- Right Partition: After 10-year luck pillar (position 4 only) -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="relative flex-shrink-0 mx-3 self-stretch"
                       style="width: 2px;">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-70"></div>
                  </div>
                </template>
              </div>
              
              <!-- Vertical WuXing Flow Indicators - Always present to maintain consistent spacing -->
              <div class="flex gap-1 -mt-1.5 -mb-1.5 relative z-40 items-center">
                <template v-for="(pillar, index) in pillarsOrdered" :key="`flow-${index}`">
                  <!-- Left Partition spacer: Before 10-year luck pillar -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="flex-shrink-0 mx-3" style="width: 2px;"></div>
                  
                <div class="flex justify-center items-center h-5 w-28 flex-shrink-0">
                  <div v-if="viewMode !== 'base' && !pillar.isUnknown && getVerticalWuXingRelation(pillar.stem.element, pillar.branch.element)"
                       class="text-lg font-bold"
                       :class="getVerticalWuXingClass(pillar.stem.element, pillar.branch.element)"
                       :title="`${pillar.stem.element} to ${pillar.branch.element}`">
                    {{ getVerticalWuXingRelation(pillar.stem.element, pillar.branch.element) }}
                  </div>
                </div>
                
                  <!-- Right Partition spacer: After 10-year luck pillar -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="flex-shrink-0 mx-3" style="width: 2px;"></div>
                </template>
              </div>
              
              <!-- Earthly Branches Row -->
              <div class="flex gap-1 overflow-visible items-stretch">
                <template v-for="(pillar, index) in pillarsOrdered" :key="`branch-${index}`">
                  <!-- Left Partition: Before 10-year luck pillar -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="relative flex-shrink-0 mx-3 self-stretch"
                       style="width: 2px;">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-70"></div>
                  </div>
                  
                  <!-- Pillar Content -->
                <div class="relative w-28 flex-shrink-0">
                  <div 
                    :id="`branch-${index}`"
                    class="pb-0 pt-2 px-3 rounded transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-start"
                    :class="[
                      hoveredNode === `branch-${index}` ? 'shadow-lg scale-105' : 'border border-gray-300',
                      highlightedNodes.includes(`branch-${index}`) ? 'ring-4 ring-blue-500 ring-offset-2 shadow-xl scale-105 z-50' : '',
                      index === 1 ? 'border-2 border-blue-500' : '',
                      pillar.is10YearLuck ? 'border-2 border-purple-500' : '',
                      pillar.isAnnualLuck && !includeAnnualLuck ? 'opacity-40 grayscale' : '',
                      pillar.isMonthlyLuck && !includeMonthlyLuck ? 'opacity-40 grayscale' : '',
                      pillar.isDailyLuck && !includeDailyLuck ? 'opacity-40 grayscale' : '',
                      pillar.isHourlyLuck && !includeHourlyLuck ? 'opacity-40 grayscale' : '',
                      pillar.isUnknown ? 'bg-gray-100 border-dashed opacity-60' : ''
                    ]"
                    :style="pillar.isUnknown ? { aspectRatio: '1/1.2' } : {
                      ...getNodeBgColor(pillar.branch.element, pillar.branch.color),
                      aspectRatio: '1/1.2'  // 20% taller than square
                    }"
                  >
                    <!-- Transformation Badge (top-right corner) -->
                    <div v-if="pillar.branchTransformBadge" 
                         class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-full shadow-md transform hover:scale-110 transition-transform z-10"
                         :style="getTransformBadgeStyle(pillar.branchTransformBadge)">
                      {{ getTransformBadgeDisplay(pillar.branchTransformBadge) }}
                    </div>
                    
                    <!-- Main content with proper spacing from bottom -->
                    <div class="flex-1 flex flex-col items-center justify-center pb-10">
                      <!-- Branch pinyin name (always show original) -->
                      <div v-if="!pillar.isUnknown" class="text-xs text-gray-700 mb-1">
                        {{ pillar.branchName }}
                      </div>
                      <!-- Chinese character (always show original from base) -->
                      <div class="text-2xl font-bold text-black">
                        {{ pillar.branch.chinese }}
                      </div>
                      <!-- Animal name (always show) -->
                      <div v-if="!pillar.isUnknown" class="text-xs text-gray-800">{{ pillar.branch.animal }}</div>
                    </div>
                    
                    <!-- Hidden Heavenly Stems - Anchored to bottom -->
                    <div v-if="pillar.hiddenStems || pillar.hiddenQi" class="absolute bottom-0 left-0 right-0 flex rounded-b overflow-hidden h-10">
                      <div 
                        v-for="(qiData, stem) in getHiddenStemsWithWeights(pillar)" 
                        :key="stem"
                        class="flex flex-col items-center justify-start text-black overflow-hidden pt-1 pb-0.5 h-full"
                        :style="{
                          ...getNodeBgColor(getStemElement(stem), qiData.color),
                          width: `${qiData.weight}%`
                        }"
                        :title="`${stem}: ${qiData.god ? qiData.god + ' - ' : ''}Score: ${qiData.score || 'N/A'} (${qiData.weight}%)`"
                      >
                        <!-- Vertical layout: pinyin, char, ten god -->
                        <div class="text-[8px] text-gray-600 leading-tight">{{ stem }}</div>
                        <div class="text-[10px] text-black leading-tight">{{ stemMappings[stem] || stem }}</div>
                        <div class="text-[8px] text-gray-800 font-medium leading-tight">{{ qiData.god || '' }}</div>
                      </div>
                    </div>
                    
                    
                    <!-- Horizontal WuXing Flow to Next Branch (only in post/transformed view) -->
                    <div v-if="viewMode !== 'base' && !pillar.isUnknown && index < pillarsOrdered.length - 1 && !pillarsOrdered[index + 1].isUnknown && getWuXingRelation(pillar.branch.element, pillarsOrdered[index + 1].branch.element)"
                         class="absolute -right-3 top-1/3 -translate-y-1/2 text-lg font-bold z-50"
                         :class="getWuXingRelationClass(pillar.branch.element, pillarsOrdered[index + 1].branch.element)"
                         :title="`${pillar.branch.element} to ${pillarsOrdered[index + 1].branch.element}`">
                      {{ getWuXingRelation(pillar.branch.element, pillarsOrdered[index + 1].branch.element) }}
                    </div>
                  </div>
                </div>
                
                  <!-- Right Partition: After 10-year luck pillar -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="relative flex-shrink-0 mx-3 self-stretch"
                       style="width: 2px;">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-70"></div>
                  </div>
                </template>
              </div>
              
              <!-- View Mode Toggle - Base, Post Interaction -->
              <div class="mt-4 mb-2 max-w-lg">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-600">View:</span>
                  <div class="flex bg-gray-100 rounded-md p-0.5">
                    <button
                      @click="viewMode = 'base'"
                      :class="[
                        'px-3 py-1 text-xs rounded transition-all',
                        viewMode === 'base' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      ]"
                    >
                      Base
                    </button>
                    <button
                      @click="viewMode = 'post'"
                      :class="[
                        'px-3 py-1 text-xs rounded transition-all',
                        viewMode === 'post' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      ]"
                    >
                      Post Interaction
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Interactions Toggle Button - Only show in post/transformed view if there are interactions -->
              <div v-if="viewMode !== 'base' && pillarsOrdered && nonNaturalInteractions.length > 0" class="max-w-lg">
                <button
                  @click="showInteractions = !showInteractions"
                  class="px-2 py-1 text-left flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg :class="['w-3 h-3 mr-2 transition-transform', showInteractions ? 'rotate-90' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span>Interactions</span>
                </button>
              </div>
              
              <!-- Interaction Labels Below Chart -->
              <div v-if="showInteractions && pillarsOrdered && interactions" class="flex gap-1 mt-2 items-start">
                <template v-for="(pillar, index) in pillarsOrdered" :key="`interactions-${index}`">
                  <!-- Left Partition spacer: Before 10-year luck pillar -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="flex-shrink-0 mx-3" style="width: 2px; min-height: 20px;"></div>
                  
                <div class="text-xs w-28 flex-shrink-0">
                  <!-- Pillar Interactions -->
                  <div v-if="getPillarInteractionData(index).length > 0" class="space-y-1">
                    <div 
                      v-for="(interaction, idx) in getPillarInteractionData(index)" 
                      :key="`${index}-${idx}`"
                      @mouseenter="highlightInteraction(interaction)"
                      @mouseleave="clearHighlight()"
                      :class="[
                        'border rounded p-2 cursor-pointer transition-all',
                        interaction.isLuckInteraction 
                          ? (interaction.effect === 'positive' 
                              ? 'bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400' 
                              : 'bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400')
                          : (isInteractionHighlighted(interaction) 
                              ? 'border-blue-400 bg-blue-50 shadow-md' 
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100')
                      ]"
                    >
                      <div 
                        class="font-medium text-[11px] leading-tight"
                        :class="interaction.isLuckInteraction 
                          ? (interaction.effect === 'positive' ? 'text-green-700' : 'text-red-700')
                          : 'text-gray-700'"
                      >
                        {{ interaction.display }}
                      </div>
                      <div v-if="interaction.subtitle" class="text-[10px] mt-0.5" 
                           :class="interaction.isLuckInteraction ? 'text-gray-600' : 'text-gray-500'">
                        {{ interaction.subtitle }}
                      </div>
                    </div>
                  </div>
                  <!-- Empty placeholder if no interactions -->
                  <div v-else class="min-h-[20px]"></div>
                </div>
                
                  <!-- Right Partition spacer: After 10-year luck pillar -->
                  <div v-if="index === 4 && pillarsOrdered.length > 4" 
                       class="flex-shrink-0 mx-3" style="width: 2px; min-height: 20px;"></div>
                </template>
              </div>
            </div>
            
            <!-- Interaction Tooltip -->
            <div 
              v-if="tooltipContent"
              class="absolute bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-50 max-w-xs pointer-events-none"
              :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
            >
              <div class="font-semibold mb-1">{{ tooltipContent.title }}</div>
              <div class="text-gray-300">{{ tooltipContent.description }}</div>
              <div v-if="tooltipContent.effect" class="mt-1 text-yellow-300">
                Effect: {{ tooltipContent.effect }}
              </div>
            </div>
          </div>
          
          <!-- Element Scores Comparison (Wu Xing) -->
          <div v-if="chartData?.daymaster_analysis" class="mt-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 max-w-2xl">
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="text-xs font-semibold text-gray-800">五行 Wu Xing Elements</h3>
              <div class="text-[9px] text-gray-500">
                Linked to: <span class="font-medium">{{ viewMode === 'base' ? 'Base' : 'Post Interaction' }}</span>
              </div>
            </div>
            <div class="text-[9px] text-gray-500 mb-1">Total: {{ Math.round(viewMode === 'base' ? naiveTotal : finalTotal) }} pts</div>
            <div class="space-y-1">
              <div v-for="element in fiveElementsWithRelations" :key="element.name">
                <div class="flex justify-between items-center text-[10px] mb-0.5">
                  <div class="flex items-center gap-1">
                    <span :class="getElementColor(element.name)" class="font-medium">{{ element.name }}</span>
                    <span v-if="element.relationship" class="text-[8px] px-0.5 py-0 bg-gray-100 rounded text-gray-600">{{ element.relationship }}</span>
                    <span v-if="viewMode === 'post' && element.change > 0" class="text-[8px] px-0.5 py-0 bg-green-50 text-green-600 rounded opacity-80">↑</span>
                    <span v-else-if="viewMode === 'post' && element.change < 0" class="text-[8px] px-0.5 py-0 bg-red-50 text-red-600 rounded opacity-80">↓</span>
                  </div>
                  <span class="text-gray-600 text-[9px]">
                    <template v-if="viewMode === 'base'">{{ Math.round(element.naive) }}</template>
                    <template v-else>{{ Math.round(element.naive) }} → {{ Math.round(element.final) }}<span :class="element.change > 0 ? 'text-green-600 font-medium' : element.change < 0 ? 'text-red-600 font-medium' : 'text-gray-400'">({{ element.change > 0 ? '+' : '' }}{{ Math.round(element.change) }})</span></template>
                  </span>
                </div>
                <div class="relative h-4 bg-gray-100 rounded overflow-hidden">
                  <div class="absolute inset-0 flex"><div class="w-1/5 border-r border-gray-200"></div><div class="w-1/5 border-r border-gray-200"></div><div class="w-1/5 border-r border-gray-200"></div><div class="w-1/5 border-r border-gray-200"></div><div class="w-1/5"></div></div>
                  <template v-if="viewMode === 'base'">
                    <div class="absolute top-0 left-0 h-full rounded transition-all duration-500" :class="getElementBgColor(element.name)" :style="`width: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"></div>
                    <div class="absolute top-0 h-full flex items-center transition-all duration-500" :style="`left: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"><span class="ml-1 text-[8px] font-medium text-gray-700">{{ Math.round((element.naive / maxElementScore) * 100) }}%</span></div>
                  </template>
                  <template v-else>
                    <template v-if="element.change > 0">
                      <div class="absolute top-0 left-0 h-full rounded-l transition-all duration-500" :class="getElementBgColor(element.name)" :style="`width: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"></div>
                      <div class="absolute top-0 h-full rounded-r transition-all duration-500" :class="getElementBgColor(element.name)" :style="`left: ${Math.min((element.naive / maxElementScore) * 100, 100)}%; width: ${Math.min(((element.final - element.naive) / maxElementScore) * 100, 100 - (element.naive / maxElementScore) * 100)}%; background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px);`"></div>
                    </template>
                    <template v-else>
                      <div class="absolute top-0 left-0 h-full rounded transition-all duration-500" :class="[element.change < 0 ? 'border border-dotted' : 'border', getElementBorderColor(element.name)]" :style="`width: ${Math.min((element.naive / maxElementScore) * 100, 100)}%; background-color: transparent;`"></div>
                      <div class="absolute top-0 left-0 h-full rounded transition-all duration-700" :class="[getElementBgColor(element.name), element.change < 0 ? 'opacity-80' : '']" :style="`width: ${Math.min((element.final / maxElementScore) * 100, 100)}%`"></div>
                    </template>
                    <div class="absolute top-0 h-full flex items-center transition-all duration-500" :style="`left: ${Math.min((element.final / maxElementScore) * 100, 100)}%`"><span class="ml-1 text-[8px] font-medium text-gray-700">{{ Math.round((element.final / maxElementScore) * 100) }}%</span></div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Day Master Analysis -->
          <div v-if="chartData?.daymaster_analysis" class="mt-2 p-2 bg-blue-50 rounded-lg max-w-2xl">
            <div class="text-[10px]">
              <span class="font-semibold">Day Master:</span> 
              {{ chartData?.daymaster_analysis?.daymaster }} 
              ({{ chartData?.daymaster_analysis?.daymaster_strength }} - {{ Math.round(chartData?.daymaster_analysis?.daymaster_percentage) }}%)
            </div>
            <div class="text-[10px] mt-1">
              <span class="font-semibold text-green-700">Favorable:</span> 
              {{ chartData?.daymaster_analysis?.favorable_elements?.join(', ') }}
            </div>
            <div class="text-[10px]">
              <span class="font-semibold text-red-700">Unfav:</span> 
              {{ chartData?.daymaster_analysis?.unfavorable_elements?.join(', ') }}
            </div>
          </div>
          
          <!-- Analysis Period Info -->
          <div v-if="chartData?.analysis_info && (chartData.analysis_info.has_luck_pillar || chartData.analysis_info.has_annual || chartData.analysis_info.has_monthly || chartData.analysis_info.has_daily || chartData.analysis_info.has_hourly)" class="mt-2 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 max-w-2xl">
            <div class="text-[10px] font-semibold text-indigo-900 mb-1">📅 Analysis Period</div>
            <div class="grid grid-cols-2 gap-1 text-[9px]">
              <div v-if="chartData.analysis_info.year">
                <span class="font-medium text-indigo-700">Year:</span> 
                <span class="text-gray-700">{{ chartData.analysis_info.year }}</span>
              </div>
              <div v-if="chartData.analysis_info.month">
                <span class="font-medium text-indigo-700">Month:</span> 
                <span class="text-gray-700">{{ chartData.analysis_info.month }}</span>
              </div>
              <div v-if="chartData.analysis_info.day">
                <span class="font-medium text-indigo-700">Day:</span> 
                <span class="text-gray-700">{{ chartData.analysis_info.day }}</span>
              </div>
              <div v-if="chartData.analysis_info.time">
                <span class="font-medium text-indigo-700">Time:</span> 
                <span class="text-gray-700">{{ chartData.analysis_info.time }}</span>
              </div>
            </div>
            <div class="mt-1.5 pt-1.5 border-t border-indigo-200 text-[9px] text-indigo-600">
              <div class="flex flex-wrap gap-1">
                <span v-if="chartData.analysis_info.has_luck_pillar" class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">10-Year Luck</span>
                <span v-if="chartData.analysis_info.has_annual" class="px-2 py-0.5 rounded-full" style="background: #FEF3C7; color: #92400E; border: 1px solid #D97706;">Annual ✓</span>
                <span v-if="chartData.analysis_info.annual_disabled" class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full opacity-60">Annual (display only)</span>
                <span v-if="chartData.analysis_info.has_monthly" class="px-2 py-0.5 rounded-full" style="background: #FEF3C7; color: #92400E; border: 1px solid #D97706;">Monthly</span>
                <span v-if="chartData.analysis_info.has_daily" class="px-2 py-0.5 rounded-full" style="background: #FEF3C7; color: #92400E; border: 1px solid #D97706;">Daily</span>
                <span v-if="chartData.analysis_info.has_hourly" class="px-2 py-0.5 rounded-full" style="background: #FEF3C7; color: #92400E; border: 1px solid #D97706;">Hourly</span>
              </div>
              <div v-if="chartData.analysis_info.annual_disabled" class="mt-1 text-[8px] text-gray-600 italic">
                💡 Year {{ chartData.analysis_info.year }} determines 10-year luck only. Annual pillar shown but excluded from element balance and interactions.
              </div>
            </div>
          </div>
          
          <!-- Current Luck Pillar Timing Info -->
          <div v-if="currentLuckPillar" class="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200 max-w-2xl">
            <div class="text-[10px] font-semibold text-purple-900 mb-1">Current 10-Year Luck Pillar</div>
            <div class="text-[9px]">
              <span class="font-medium">Period:</span> 
              {{ currentLuckPillar.timing.start_year }} - {{ currentLuckPillar.timing.end_year }}
            </div>
            <div class="text-[9px]">
              <span class="font-medium">Age Range:</span> 
              {{ Math.floor(currentLuckPillar.timing.start_age) }} - {{ Math.floor(currentLuckPillar.timing.end_age) }} years old
            </div>
            <div class="text-[9px] text-purple-700 mt-1 bg-purple-100 border border-purple-300 p-2 rounded">
              <strong>⏰ Temporal Overlay:</strong> The 10-year luck pillar is a <strong>time period</strong> that overlays your entire natal chart.
              It interacts with <strong>all four natal pillars</strong> (Year, Month, Day, Hour) <strong>equally and adjacently</strong>,
              regardless of its visual position in the UI. This reflects authentic BaZi metaphysics where luck periods are temporal influences, not spatial positions.
            </div>
            
            <!-- Luck Pillar Interactions -->
            <div v-if="luckPillarInteractions.length > 0" class="mt-1.5 pt-1.5 border-t border-purple-200">
              <div class="text-[9px] font-semibold text-purple-900 mb-1">Interactions with Natal Chart:</div>
              <div class="space-y-0.5">
                <div v-for="(interaction, idx) in luckPillarInteractions" :key="idx" 
                     class="text-[9px] p-1 rounded"
                     :class="interaction.effect === 'positive' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
                  <span class="font-medium" :class="interaction.effect === 'positive' ? 'text-green-700' : 'text-red-700'">
                    {{ interaction.label }}
                  </span>
                  <span class="text-gray-700 ml-1">{{ interaction.description }}</span>
                </div>
              </div>
            </div>
            <div v-else class="mt-1.5 pt-1.5 border-t border-purple-200 text-[9px] text-gray-600">
              No major interactions (harmonies/clashes) detected with natal chart.
            </div>
          </div>
        </div>
      </div>
        </div>
        <!-- End of Left Section -->

        <!-- Right: Collapsible Trace Panel -->
        <div 
          v-if="interactions.length > 0"
          class="transition-all duration-300"
          :class="showInteractionLog ? 'w-[420px]' : 'w-12'"
        >
          <!-- Toggle Button (always visible) -->
          <button
            @click="showInteractionLog = !showInteractionLog"
            class="sticky top-4 w-full h-12 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center border border-gray-200 hover:border-blue-300 mb-4 z-10"
            :class="showInteractionLog ? 'justify-between px-4' : ''"
          >
            <template v-if="showInteractionLog">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-800">Trace Log</span>
                <span class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {{ interactions.length }}
                </span>
              </div>
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </template>
            <template v-else>
              <svg class="w-5 h-5 text-gray-600 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </template>
          </button>

          <!-- Trace Panel Content (expanded) -->
          <div 
            v-show="showInteractionLog"
            class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <!-- Panel Header -->
            <div class="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <h3 class="text-sm font-bold text-gray-800">Interaction Trace</h3>
              <p class="text-xs text-gray-600 mt-0.5">Real-time element flow analysis</p>
            </div>

            <!-- Log Entries (scrollable) -->
            <div class="overflow-y-auto bg-gray-50" style="max-height: calc(100vh - 200px);">
              <div class="p-3 space-y-2">
                <!-- Log Entry -->
                <div
                  v-for="(interaction, index) in interactions"
                  :key="`log-${index}`"
                  @mouseenter="hoveredLogInteraction = index; highlightInteractionFromLog(interaction)"
                  @mouseleave="hoveredLogInteraction = null; clearHighlight()"
                  class="bg-white border rounded-lg p-3 font-mono text-xs transition-all cursor-pointer"
                  :class="[
                    hoveredLogInteraction === index ? 'border-blue-400 shadow-md ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300',
                    getLogBorderClass(interaction.type)
                  ]"
                >
                  <!-- Log Header Line -->
                  <div class="flex items-start gap-2 mb-2">
                    <span class="text-gray-400 select-none text-[10px] mt-0.5">[{{ String(index + 1).padStart(3, '0') }}]</span>
                    <div class="flex-1 min-w-0">
                      <!-- Type and badges -->
                      <div class="flex flex-wrap items-center gap-1 mb-1">
                        <span class="font-semibold text-[11px]" :class="getInteractionTextColor(interaction.type)">
                          {{ formatInteractionType(interaction.type).split(' ')[1] || formatInteractionType(interaction.type) }}
                        </span>
                        <span v-if="interaction.pattern" class="px-1 py-0.5 bg-gray-100 rounded text-[9px]">
                          {{ interaction.pattern }}
                        </span>
                        <span v-if="interaction.adjacent" class="px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[9px]">
                          ADJ
                        </span>
                      </div>
                      
                      <!-- Nodes -->
                      <div class="text-gray-600 mb-1 text-[10px] break-words">
                        <span class="text-gray-400">nodes:</span>
                        <div class="mt-0.5">
                          <span v-for="(node, nIdx) in (interaction.nodes || [])" :key="nIdx" class="block">
                            {{ nIdx > 0 ? '↔ ' : '' }}<span class="text-blue-600 font-medium">{{ formatNodeName(node) }}</span>
                          </span>
                        </div>
                      </div>
                      
                      <!-- Effect badges -->
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span v-if="interaction.effect" 
                              class="px-1.5 py-0.5 rounded text-[9px] font-sans font-medium"
                              :class="{
                                'bg-red-100 text-red-700': interaction.effect === 'High',
                                'bg-orange-100 text-orange-700': interaction.effect === 'Medium',
                                'bg-yellow-100 text-yellow-700': interaction.effect === 'Low',
                                'bg-gray-100 text-gray-600': interaction.effect === 'None'
                              }">
                          {{ interaction.effect }}
                        </span>
                        
                        <span v-if="interaction.branches && interaction.branches.length" 
                              class="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-sans">
                          {{ interaction.branches.join(', ') }}
                        </span>
                      </div>
                      
                      <!-- Pre/Post Element Scores -->
                      <div v-if="getInteractionElementScores(interaction)" class="mt-2 pt-2 border-t border-gray-100">
                        <div class="text-gray-400 text-[9px] mb-1">element_scores:</div>
                        <div class="space-y-1">
                          <div v-for="(score, element) in getInteractionElementScores(interaction)" :key="element" class="text-[9px]">
                            <div class="flex items-center justify-between">
                              <span class="text-gray-600">{{ element }}</span>
                              <span class="font-medium">
                                <span class="text-gray-400">{{ Math.round(score.pre) }}</span>
                                <span class="text-gray-400 mx-1">→</span>
                                <span :class="score.change > 0 ? 'text-green-600' : score.change < 0 ? 'text-red-600' : 'text-gray-600'">
                                  {{ Math.round(score.post) }}
                                </span>
                                <span v-if="score.change !== 0" 
                                      class="ml-1"
                                      :class="score.change > 0 ? 'text-green-600' : 'text-red-600'">
                                  ({{ score.change > 0 ? '+' : '' }}{{ Math.round(score.change) }})
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Description -->
                      <div class="mt-2 text-gray-500 italic text-[9px] break-words">
                        // {{ formatInteractionDescription(interaction) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End of Right Panel -->
      </div>
      <!-- End of Flex Container -->
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// LocalStorage keys
const STORAGE_KEY = 'bazingse_form_data'

// Helper to load from localStorage
function loadFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    console.error('Error loading from localStorage:', e)
    return null
  }
}

// Helper to save to localStorage
function saveToStorage() {
  if (typeof window === 'undefined') return
  try {
    const data = {
      birthDate: birthDate.value,
      birthTime: birthTime.value,
      gender: gender.value,
      unknownHour: unknownHour.value,
      yearInput: yearInput.value,
      monthInput: monthInput.value,
      dayInput: dayInput.value,
      analysisYear: analysisYear.value,
      analysisMonth: analysisMonth.value,
      analysisDay: analysisDay.value,
      analysisTime: analysisTime.value,
      showAnalysisPeriod: showAnalysisPeriod.value,
      includeAnnualLuck: includeAnnualLuck.value,
      includeMonthlyLuck: includeMonthlyLuck.value,
      includeDailyLuck: includeDailyLuck.value,
      includeHourlyLuck: includeHourlyLuck.value,
      viewMode: viewMode.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

// Load saved values or use defaults
const savedData = loadFromStorage()

// Form data
const birthDate = ref(savedData?.birthDate || '1992-07-06')
const birthTime = ref(savedData?.birthTime || '09:30')
const gender = ref(savedData?.gender || 'female')
const isLoading = ref(false)
const chartData = ref(null)
const currentLuckPillar = ref(null)  // Current 10-year luck pillar
const annualLuckPillar = ref(null)  // Current annual luck pillar
const unknownHour = ref(savedData?.unknownHour || false)

// Individual pillar inputs
const yearInput = ref(savedData?.yearInput || 1992)
const monthInput = ref(savedData?.monthInput || 7)
const dayInput = ref(savedData?.dayInput || 6)

// Analysis period controls (for time travel functionality)
const analysisYear = ref(savedData?.analysisYear || null)
const analysisMonth = ref(savedData?.analysisMonth || null)
const analysisDay = ref(savedData?.analysisDay || null)
const analysisTime = ref(savedData?.analysisTime || '')
const showAnalysisPeriod = ref(savedData?.showAnalysisPeriod || false)
const includeAnnualLuck = ref(savedData?.includeAnnualLuck !== undefined ? savedData.includeAnnualLuck : true)
const includeMonthlyLuck = ref(savedData?.includeMonthlyLuck !== undefined ? savedData.includeMonthlyLuck : true)
const includeDailyLuck = ref(savedData?.includeDailyLuck !== undefined ? savedData.includeDailyLuck : true)
const includeHourlyLuck = ref(savedData?.includeHourlyLuck !== undefined ? savedData.includeHourlyLuck : true)

// Calculate grid columns for luck pillars (backward compatibility)
const luckPillarCount = computed(() => {
  let count = 0
  if (currentLuckPillar.value) count++
  if (annualLuckPillar.value) count++
  return count
})

// Total pillar count (dynamic: 4 natal + analysis pillars)
const totalPillarCount = computed(() => {
  // If no chart data yet, return 4 (natal only)
  if (!chartData.value) return 4
  
  let count = 4  // Base natal pillars (hour, day, month, year)
  
  if (chartData.value?.analysis_info) {
    const info = chartData.value.analysis_info
    if (info.has_luck_pillar) count++  // 10-year luck
    if (info.has_annual) count++       // Annual
    if (info.has_monthly) count++      // Monthly
    if (info.has_daily) count++        // Daily
    if (info.has_hourly) count++       // Hourly
  }
  
  // Ensure count is within valid range (4-9)
  return Math.max(4, Math.min(9, count))
})

// Update birthDate from individual pillar inputs
function updateDateFromPillars() {
  const year = yearInput.value || new Date().getFullYear()
  const month = String(monthInput.value || 1).padStart(2, '0')
  const day = String(dayInput.value || 1).padStart(2, '0')
  birthDate.value = `${year}-${month}-${day}`
}

// Initialize pillar inputs from birthDate
function initializePillarInputs() {
  if (birthDate.value) {
    const [year, month, day] = birthDate.value.split('-')
    yearInput.value = parseInt(year)
    monthInput.value = parseInt(month)
    dayInput.value = parseInt(day)
  }
}

// Debounce timer
let debounceTimer = null

// Handle input changes with debounce
function handleInputChange() {
  updateDateFromPillars()
  
  // Save to localStorage
  saveToStorage()
  
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Set new timer to generate chart after 500ms of no changes
  debounceTimer = setTimeout(() => {
    generateChart()
  }, 500)
}

// Handle unknown hour toggle
function handleUnknownHourChange() {
  if (!unknownHour.value) {
    // Restore to default time when unchecking unknown
    birthTime.value = '12:00'
  }
  handleInputChange()
}

// Handle analysis mode toggle
function handleAnalysisModeToggle() {
  if (showAnalysisPeriod.value && !analysisYear.value) {
    // Pre-fill with current year for convenience
    analysisYear.value = new Date().getFullYear()
  }
  handleInputChange()
}

// Watch for cascading resets when toggles are disabled
watch(includeAnnualLuck, (newValue) => {
  if (!newValue) {
    // Clear monthly and all dependent values
    analysisMonth.value = null
    analysisDay.value = null
    analysisTime.value = ''
  }
})

watch(includeMonthlyLuck, (newValue) => {
  if (!newValue) {
    // Clear daily and hourly
    analysisDay.value = null
    analysisTime.value = ''
  }
})

watch(includeDailyLuck, (newValue) => {
  if (!newValue) {
    // Clear hourly
    analysisTime.value = ''
  }
})

// Clear analysis period
function clearAnalysisPeriod() {
  analysisYear.value = null
  analysisMonth.value = null
  analysisDay.value = null
  analysisTime.value = ''
  handleInputChange()
}

// Initialize on mount (client-side only)
onMounted(() => {
  console.log('Component mounted, initializing...')
  initializePillarInputs()
  // Generate initial chart after component mounts
  setTimeout(() => {
    console.log('Calling generateChart from onMounted')
    generateChart()
  }, 100)
})

// Interactive UI state
const hoveredNode = ref(null)
const hoveredInteraction = ref(null)
const highlightedNodes = ref([])
const activeConnections = ref([])
const showConnections = ref(true)
const tooltipContent = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })

// View mode state: 'base' or 'post' - default to 'post' to show energy flow
// This controls both the interaction view and Wu Xing element graph
const viewMode = ref(savedData?.viewMode || 'post')
const showTransformed = computed(() => viewMode.value === 'post')

// Interactions display state
const showInteractions = ref(false)
const highlightedInteraction = ref(null)

// Interaction log state
const showInteractionLog = ref(true)  // Open by default
const hoveredLogInteraction = ref(null)

// Watch for view mode changes to hide interactions in Base view
watch(viewMode, (newMode) => {
  if (newMode === 'base') {
    showInteractions.value = false
  }
  // Save view mode preference
  saveToStorage()
})

// Stem and Branch mappings
const stemMappings = {
  'Jia': '甲', 'Yi': '乙', 'Bing': '丙', 'Ding': '丁', 'Wu': '戊',
  'Ji': '己', 'Geng': '庚', 'Xin': '辛', 'Ren': '壬', 'Gui': '癸'
}

// Ten God abbreviation to full name mappings
const tenGodMappings = {
  'F': 'Companion',
  'RW': 'Robbery',
  'EG': 'Output',
  'HO': 'Hurting',
  'IW': 'Wealth',
  'DW': 'Direct Wealth',
  '7K': 'Officer',
  'DO': 'Direct Officer',
  'IR': 'Resource',
  'DR': 'Direct Resource',
  // Keep full names as is
  'Companion': 'Companion',
  'Robbery': 'Robbery',
  'Output': 'Output',
  'Hurting': 'Hurting',
  'Wealth': 'Wealth',
  'Direct Wealth': 'Direct Wealth',
  'Officer': 'Officer',
  'Direct Officer': 'Direct Officer',
  'Resource': 'Resource',
  'Direct Resource': 'Direct Resource'
}

// Branch name to Chinese character mappings
const branchMappings = {
  'Zi': '子', 'Chou': '丑', 'Yin': '寅', 'Mao': '卯',
  'Chen': '辰', 'Si': '巳', 'Wu': '午', 'Wei': '未',
  'Shen': '申', 'You': '酉', 'Xu': '戌', 'Hai': '亥'
}

// Branch polarity mappings based on BaZi theory
const branchPolarities = {
  'Zi': 'Yang',   // Yang Water
  'Chou': 'Yin',  // Yin Earth
  'Yin': 'Yang',  // Yang Wood
  'Mao': 'Yin',   // Yin Wood
  'Chen': 'Yang', // Yang Earth
  'Si': 'Yang',   // Yang Fire
  'Wu': 'Yang',   // Yang Fire
  'Wei': 'Yin',   // Yin Earth
  'Shen': 'Yang', // Yang Metal
  'You': 'Yin',   // Yin Metal
  'Xu': 'Yang',   // Yang Earth
  'Hai': 'Yin'    // Yin Water
}

// Element to Chinese character mappings (for transformed display)
const elementCharacterMappings = {
  'Wood': '木',
  'Fire': '火',
  'Earth': '土',
  'Metal': '金',
  'Water': '水',
  'Yang Wood': '木',
  'Yin Wood': '木',
  'Yang Fire': '火',
  'Yin Fire': '火',
  'Yang Earth': '土',
  'Yin Earth': '土',
  'Yang Metal': '金',
  'Yin Metal': '金',
  'Yang Water': '水',
  'Yin Water': '水'
}

const HEAVENLY_STEMS = {
  'Jia': { chinese: '甲', element: 'Yang Wood' },
  'Yi': { chinese: '乙', element: 'Yin Wood' },
  'Bing': { chinese: '丙', element: 'Yang Fire' },
  'Ding': { chinese: '丁', element: 'Yin Fire' },
  'Wu': { chinese: '戊', element: 'Yang Earth' },
  'Ji': { chinese: '己', element: 'Yin Earth' },
  'Geng': { chinese: '庚', element: 'Yang Metal' },
  'Xin': { chinese: '辛', element: 'Yin Metal' },
  'Ren': { chinese: '壬', element: 'Yang Water' },
  'Gui': { chinese: '癸', element: 'Yin Water' }
}

const EARTHLY_BRANCHES = {
  'Zi': { chinese: '子', animal: 'Rat', element: 'Yang Water' },
  'Chou': { chinese: '丑', animal: 'Ox', element: 'Yin Earth' },
  'Yin': { chinese: '寅', animal: 'Tiger', element: 'Yang Wood' },
  'Mao': { chinese: '卯', animal: 'Rabbit', element: 'Yin Wood' },
  'Chen': { chinese: '辰', animal: 'Dragon', element: 'Yang Earth' },
  'Si': { chinese: '巳', animal: 'Snake', element: 'Yin Fire' },
  'Wu': { chinese: '午', animal: 'Horse', element: 'Yang Fire' },
  'Wei': { chinese: '未', animal: 'Goat', element: 'Yin Earth' },
  'Shen': { chinese: '申', animal: 'Monkey', element: 'Yang Metal' },
  'You': { chinese: '酉', animal: 'Rooster', element: 'Yin Metal' },
  'Xu': { chinese: '戌', animal: 'Dog', element: 'Yang Earth' },
  'Hai': { chinese: '亥', animal: 'Pig', element: 'Yin Water' }
}

// Check if there are transformations
const hasTransformations = computed(() => {
  if (!chartData.value?.nodes) return false
  
  // Check if any node has been transformed
  for (const node of Object.values(chartData.value.nodes)) {
    if (node.transformed) return true
  }
  return false
})

// Count number of transformations
const transformationCount = computed(() => {
  if (!chartData.value?.nodes) return 0
  
  let count = 0
  for (const node of Object.values(chartData.value.nodes)) {
    if (node.transformed) count++
  }
  return count
})

// Get the active chart (original or transformed)
const activeChart = computed(() => {
  // Since API now returns nodes directly, we don't need natal_chart
  // Return null to force using the nodes-based approach
  return null
})

// Helper to parse pillar (handles both normal and transformed format)
function parsePillarForDisplay(pillarStr, isTransformed = false) {
  const parts = pillarStr.split(' ')
  
  // Handle transformed format like "Bing Fire" where branch is replaced by element
  if (parts.length === 2 && (parts[1] === 'Fire' || parts[1] === 'Water' || parts[1] === 'Wood' || parts[1] === 'Metal' || parts[1] === 'Earth')) {
    const stemName = parts[0]
    const element = parts[1]
    
    // Create a special display for transformed element branches
    return {
      stemName,
      stem: HEAVENLY_STEMS[stemName] || { chinese: stemName, element: 'Unknown' },
      branchName: element,
      branch: {
        chinese: element === 'Fire' ? '火' : element === 'Water' ? '水' : element === 'Wood' ? '木' : element === 'Metal' ? '金' : '土',
        animal: element,
        element: `Yang ${element}` // Default to Yang for transformed elements
      }
    }
  }
  
  // Normal pillar format
  const [stemName, branchName] = parts
  return {
    stemName,
    stem: HEAVENLY_STEMS[stemName] || { chinese: stemName, element: 'Unknown' },
    branchName,
    branch: EARTHLY_BRANCHES[branchName] || { chinese: branchName, animal: branchName, element: 'Unknown' }
  }
}

// Node-based chart data - now directly at top level
const nodes = computed(() => {
  if (!chartData.value) return null
  
  // Extract node data (hs_y, eb_y, etc.) from top level
  const nodeKeys = ['hs_y', 'eb_y', 'hs_m', 'eb_m', 'hs_d', 'eb_d', 'hs_h', 'eb_h', 
                    'hs_10yl', 'eb_10yl', 'hs_yl', 'eb_yl',
                    'hs_month', 'eb_month', 'hs_day', 'eb_day']
  
  const nodesData = {}
  for (const key of nodeKeys) {
    if (chartData.value[key]) {
      nodesData[key] = chartData.value[key]
    }
  }
  
  return Object.keys(nodesData).length > 0 ? nodesData : null
})

// Get node by ID
function getNode(nodeId) {
  return nodes.value?.[nodeId] || null
}

// Computed properties
const pillars = computed(() => {
  // Simple direct access to node data as requested
  if (!chartData.value) {
    console.log('pillars computed: no chartData')
    return null
  }
  
  const data = chartData.value
  const mappings = data.mappings || {}
  console.log('pillars computed: has chartData, mappings:', !!mappings)
  
  // Helper to build pillar from node data
  const buildPillar = (hsKey, ebKey, label, isDayMaster = false) => {
    const hsNode = data[hsKey]
    const ebNode = data[ebKey]
    
    if (!hsNode && !ebNode) return null
    
    // Use viewMode to determine which state to show (base or post)
    const usePost = viewMode.value === 'post'
    
    // For stems: always use the base ID for the main character
    // Store transformation_badge separately for display as a badge
    const stemId = hsNode?.base?.id
    const stemTransformBadge = usePost ? hsNode?.transformation_badge : null
    
    // Check if stem transformed to element name (like "Yang Metal")
    const isElementName = stemId && stemId.includes(' ') && ['Yang', 'Yin'].some(p => stemId.startsWith(p))
    
    let stemChinese, stemElement, stemColor
    
    if (isElementName) {
      // Handle element name transformations - map back to proper stem ID
      const elementToStemMap = {
        'Yang Metal': 'Geng',
        'Yin Metal': 'Xin',
        'Yang Water': 'Ren',
        'Yin Water': 'Gui',
        'Yang Wood': 'Jia',
        'Yin Wood': 'Yi',
        'Yang Fire': 'Bing',
        'Yin Fire': 'Ding',
        'Yang Earth': 'Wu',
        'Yin Earth': 'Ji'
      }
      const actualStemId = elementToStemMap[stemId] || stemId
      const stemMapping = mappings.heavenly_stems?.[actualStemId] || {}
      stemChinese = stemMapping.chinese || actualStemId || '?'
      stemElement = stemMapping.english || stemId
      // Use regular color from mapping for stem transformations
      stemColor = stemMapping.hex_color || hsNode?.hex_color || hsNode?.color || '#808080'
    } else {
      // Normal stem mapping
      const stemMapping = mappings.heavenly_stems?.[stemId] || {}
      stemChinese = stemMapping.chinese || stemId || '?'
      stemElement = stemMapping.english || hsNode?.element || 'Unknown'
      stemColor = stemMapping.hex_color || hsNode?.hex_color || hsNode?.color || '#808080'
    }
    
    const stem = {
      chinese: stemChinese,
      element: stemElement,
      color: stemColor
    }
    
    // Get the proper stem name (pinyin) for display
    let stemName
    if (isElementName) {
      // If it's an element name, get the corresponding stem ID
      const elementToStemMap = {
        'Yang Metal': 'Geng',
        'Yin Metal': 'Xin',
        'Yang Water': 'Ren',
        'Yin Water': 'Gui',
        'Yang Wood': 'Jia',
        'Yin Wood': 'Yi',
        'Yang Fire': 'Bing',
        'Yin Fire': 'Ding',
        'Yang Earth': 'Wu',
        'Yin Earth': 'Ji'
      }
      stemName = elementToStemMap[stemId] || stemId
    } else {
      stemName = stemId || '?'
    }
    
    // For branches: always use the base ID for the main character
    // Store transformation_badge separately for display as a badge
    const branchId = ebNode?.base?.id
    const branchTransformBadge = usePost ? ebNode?.transformation_badge : null
    
    // Check if branch transformed to pure element (Fire, Water, etc)
    const isElementTransformation = usePost && ['Fire', 'Water', 'Metal', 'Wood', 'Earth'].includes(branchId)
    
    let branchChinese, branchAnimal, branchElement, branchColor
    
    if (isElementTransformation) {
      // Handle pure element transformation - use emphasized colors
      const elementMap = {
        'Fire': { chinese: '火', color: '#ff6b6b' },
        'Water': { chinese: '水', color: '#4dabf7' },
        'Metal': { chinese: '金', color: '#868e96' },
        'Wood': { chinese: '木', color: '#51cf66' },
        'Earth': { chinese: '土', color: '#fab005' }
      }
      branchChinese = elementMap[branchId]?.chinese || branchId
      branchAnimal = branchId // Show element name instead of animal
      branchElement = branchId
      // Use emphasized color for pure element transformations
      branchColor = elementMap[branchId]?.color || '#808080'
    } else {
      // Normal branch mapping
      const branchMapping = mappings.earthly_branches?.[branchId] || {}
      branchChinese = branchMapping.chinese || branchId || '?'
      branchAnimal = branchMapping.animal || '?'
      
      // Map branch ID to element (branches have dominant elements)
      const branchToElement = {
        'Zi': 'Water',   // Rat - Water
        'Chou': 'Earth', // Ox - Earth
        'Yin': 'Wood',   // Tiger - Wood
        'Mao': 'Wood',   // Rabbit - Wood
        'Chen': 'Earth', // Dragon - Earth
        'Si': 'Fire',    // Snake - Fire
        'Wu': 'Fire',    // Horse - Fire
        'Wei': 'Earth',  // Goat - Earth
        'Shen': 'Metal', // Monkey - Metal
        'You': 'Metal',  // Rooster - Metal
        'Xu': 'Earth',   // Dog - Earth
        'Hai': 'Water'   // Pig - Water
      }
      branchElement = branchToElement[branchId] || 'Unknown'
      branchColor = ebNode?.hex_color || ebNode?.color || branchMapping.hex_color || '#808080'
    }
    
    const branch = {
      chinese: branchChinese,
      animal: branchAnimal,
      element: branchElement,
      color: branchColor
    }
    
    // Hidden stems from eb.qi - use post.qi for post view, base.qi for base view
    const hiddenQi = usePost ? (ebNode?.post?.qi || {}) : (ebNode?.base?.qi || {})
    
    // Map hidden stems to Ten Gods using frontend mappings
    const hiddenStems = {}
    if (hiddenQi && data.mappings?.ten_gods) {
      const dayMasterStem = data.hs_d?.base?.id || 'Yi'
      for (const stemName of Object.keys(hiddenQi)) {
        const tenGodData = data.mappings?.ten_gods?.[dayMasterStem]?.[stemName]
        hiddenStems[stemName] = tenGodData?.abbreviation || tenGodData?.id || ''
      }
    }
    
    // Calculate Ten God for the Heavenly Stem
    let stemTenGod = null
    if (isDayMaster) {
      stemTenGod = 'DM'
    } else if (hsNode?.base?.id && data.mappings?.ten_gods) {
      const dayMasterStem = data.hs_d?.base?.id || 'Yi'
      const tenGodData = data.mappings?.ten_gods?.[dayMasterStem]?.[hsNode.base.id]
      stemTenGod = tenGodData?.abbreviation || tenGodData?.id || null
    }
    
    return {
      label,
      stem,
      stemName: stemName,
      branch,
      branchName: branchId,
      stemKey: hsKey,
      branchKey: ebKey,
      hiddenStems,
      hiddenQi,
      tenGod: stemTenGod,
      transformed: hsNode?.transformed || ebNode?.transformed || false,
      isUnknown: !hsNode && !ebNode,
      // Node status data
      stemAlive: hsNode?.alive !== false,
      branchAlive: ebNode?.alive !== false,
      stemInteracted: hsNode?.interacted || false,
      branchInteracted: ebNode?.interacted || false,
      stemTransformed: hsNode?.transformed || false,
      branchTransformed: ebNode?.transformed || false,
      // Transformation badges
      stemTransformBadge,
      branchTransformBadge
    }
  }
  
  const yearPillar = buildPillar('hs_y', 'eb_y', 'Year 年')
  const monthPillar = buildPillar('hs_m', 'eb_m', 'Month 月')
  const dayPillar = buildPillar('hs_d', 'eb_d', 'Day 日', true)
  const hourPillar = buildPillar('hs_h', 'eb_h', 'Hour 時')
  
  // Check if we have at least the essential pillars (year, month, day)
  if (!yearPillar || !monthPillar || !dayPillar) {
    return null
  }
  
  const result = {
    year: yearPillar,
    month: monthPillar,  
    day: dayPillar,
    hour: hourPillar || {
      label: 'Hour 時',
      stem: { chinese: '?', element: 'Unknown' },
      stemName: '?',
      branch: { chinese: '?', animal: '?', element: 'Unknown' },
      branchName: '?',
      stemKey: 'hs_h',
      branchKey: 'eb_h',
      hiddenStems: null,
      tenGod: null,
      transformed: false,
      isUnknown: true
    }
  }
  
  console.log('Simplified pillars from direct node access:', result)
  return result
})

// Natal pillars only (4 columns: Hour, Day, Month, Year)
const natalPillarsOrdered = computed(() => {
  if (!pillars.value) return null
  
  return [
    pillars.value.hour,
    pillars.value.day,
    pillars.value.month,
    pillars.value.year
  ]
})

// Luck pillars only (for separate display below natal chart)
const luckPillarsOrdered = computed(() => {
  if (!chartData.value?.mappings) return []
  
  const luckPillars = []
  
  // Add 10-year luck pillar if available
  if (currentLuckPillar.value) {
    const luckPillarStr = currentLuckPillar.value.pillar
    const [hsName, ebName] = luckPillarStr.split(' ')
    const mappings = chartData.value.mappings
    
    const hsMapping = mappings.heavenly_stems?.[hsName] || {}
    const ebMapping = mappings.earthly_branches?.[ebName] || {}
    
    // Get hidden stems from backend node data
    const ebLuckNode = chartData.value?.eb_10yl
    const hsLuckNode = chartData.value?.hs_10yl
    
    // Calculate Ten God for 10Y luck HS
    const dayMasterStem = chartData.value?.hs_d?.base?.id || 'Yi'
    const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[hsName]
    const tenGodLabel = tenGodData?.abbreviation || tenGodData?.id || ''
    
    // Map hidden stems to Ten Gods using frontend mappings (use post.qi in post view, base.qi in base view)
    const usePost = viewMode.value === 'post' || viewMode.value === 'transformed'
    const luckQi = usePost ? (ebLuckNode?.post?.qi || ebLuckNode?.base?.qi || {}) : (ebLuckNode?.base?.qi || {})
    const hiddenStems = {}
    if (luckQi && mappings.ten_gods) {
      for (const stemName of Object.keys(luckQi)) {
        const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[stemName]
        hiddenStems[stemName] = tenGodData?.abbreviation || tenGodData?.id || ''
      }
    }
    
    luckPillars.push({
      label: '10Y Luck 運',
      stem: {
        chinese: hsMapping.chinese || hsName,
        element: currentLuckPillar.value.hs_element || hsMapping.english || 'Unknown',
        color: hsMapping.hex_color || '#808080'
      },
      stemName: hsName,
      branch: {
        chinese: ebMapping.chinese || ebName,
        animal: currentLuckPillar.value.eb_animal || ebMapping.animal || 'Unknown',
        element: currentLuckPillar.value.eb_animal || 'Unknown',
        color: ebMapping.hex_color || '#808080'
      },
      branchName: ebName,
      stemKey: 'hs_10yl',
      branchKey: 'eb_10yl',
      hiddenStems: hiddenStems,
      hiddenQi: ebLuckNode?.base?.qi || null,  // Get hidden stems qi from backend
      tenGod: tenGodLabel,
      transformed: ebLuckNode?.transformed || false,
      isUnknown: false,
      stemAlive: hsLuckNode?.alive !== false,
      branchAlive: ebLuckNode?.alive !== false,
      stemInteracted: hsLuckNode?.interacted || false,
      branchInteracted: ebLuckNode?.interacted || false,
      stemTransformed: hsLuckNode?.transformed || false,
      branchTransformed: ebLuckNode?.transformed || false,
      stemTransformBadge: hsLuckNode?.transformation_badge || null,
      branchTransformBadge: ebLuckNode?.transformation_badge || null,
      isLuckPillar: true,
      timing: currentLuckPillar.value.timing
    })
  }
  
  // Add annual luck pillar if available
  if (annualLuckPillar.value && chartData.value?.mappings) {
    const annualPillarStr = annualLuckPillar.value.pillar
    const [hsName, ebName] = annualPillarStr.split(' ')
    const mappings = chartData.value.mappings
    
    const hsMapping = mappings.heavenly_stems?.[hsName] || {}
    const ebMapping = mappings.earthly_branches?.[ebName] || {}
    
    // Get hidden stems from backend node data
    const ebAnnualNode = chartData.value?.eb_yl
    const hsAnnualNode = chartData.value?.hs_yl
    
    // Calculate Ten God for annual luck HS
    const dayMasterStem = chartData.value?.hs_d?.base?.id || 'Yi'
    const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[hsName]
    const tenGodLabel = tenGodData?.abbreviation || tenGodData?.id || ''
    
    // Map hidden stems to Ten Gods using frontend mappings (use post.qi in post view, base.qi in base view)
    const usePost = viewMode.value === 'post' || viewMode.value === 'transformed'
    const annualQi = usePost ? (ebAnnualNode?.post?.qi || ebAnnualNode?.base?.qi || {}) : (ebAnnualNode?.base?.qi || {})
    const hiddenStems = {}
    if (annualQi && mappings.ten_gods) {
      for (const stemName of Object.keys(annualQi)) {
        const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[stemName]
        hiddenStems[stemName] = tenGodData?.abbreviation || tenGodData?.id || ''
      }
    }
    
    luckPillars.push({
      label: 'Annual 年運',
      stem: {
        chinese: hsMapping.chinese || hsName,
        element: annualLuckPillar.value.hs_element || hsMapping.english || 'Unknown',
        color: hsMapping.hex_color || '#808080'
      },
      stemName: hsName,
      branch: {
        chinese: ebMapping.chinese || ebName,
        animal: annualLuckPillar.value.eb_animal || ebMapping.animal || 'Unknown',
        element: annualLuckPillar.value.eb_animal || 'Unknown',
        color: ebMapping.hex_color || '#808080'
      },
      branchName: ebName,
      stemKey: 'hs_yl',
      branchKey: 'eb_yl',
      hiddenStems: hiddenStems,
      hiddenQi: ebAnnualNode?.base?.qi || null,  // Get hidden stems qi from backend
      tenGod: tenGodLabel,
      transformed: ebAnnualNode?.transformed || false,
      isUnknown: false,
      stemAlive: hsAnnualNode?.alive !== false,
      branchAlive: ebAnnualNode?.alive !== false,
      stemInteracted: hsAnnualNode?.interacted || false,
      branchInteracted: ebAnnualNode?.interacted || false,
      stemTransformed: hsAnnualNode?.transformed || false,
      branchTransformed: ebAnnualNode?.transformed || false,
      stemTransformBadge: hsAnnualNode?.transformation_badge || null,
      branchTransformBadge: ebAnnualNode?.transformation_badge || null,
      isAnnualLuck: true,
      year: annualLuckPillar.value.year
    })
  }
  
  // Extract Monthly Pillar (if available)
  if (chartData.value?.analysis_info?.has_monthly && chartData.value?.hs_ml && chartData.value?.eb_ml) {
    const hsMonthlyNode = chartData.value.hs_ml
    const ebMonthlyNode = chartData.value.eb_ml
    const [hsName, ebName] = [hsMonthlyNode.base?.id, ebMonthlyNode.base?.id]
    
    if (hsName && ebName) {
      const mappings = chartData.value.mappings
      const hsMapping = mappings.heavenly_stems?.[hsName] || {}
      const ebMapping = mappings.earthly_branches?.[ebName] || {}
      
      const dayMasterStem = chartData.value?.hs_d?.base?.id || 'Yi'
      const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[hsName]
      const tenGodLabel = tenGodData?.abbreviation || tenGodData?.id || ''
      
      // Map hidden stems to Ten Gods using frontend mappings (use post.qi in post view, base.qi in base view)
      const usePost = viewMode.value === 'post' || viewMode.value === 'transformed'
      const monthlyQi = usePost ? (ebMonthlyNode?.post?.qi || ebMonthlyNode?.base?.qi || {}) : (ebMonthlyNode?.base?.qi || {})
      const hiddenStems = {}
      if (monthlyQi && mappings.ten_gods) {
        for (const stemName of Object.keys(monthlyQi)) {
          const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[stemName]
          hiddenStems[stemName] = tenGodData?.abbreviation || tenGodData?.id || ''
        }
      }
      
      luckPillars.push({
        label: 'Monthly 月運',
        stem: {
          chinese: hsMapping.chinese || hsName,
          element: hsMapping.english || 'Unknown',
          color: hsMapping.hex_color || '#808080'
        },
        stemName: hsName,
        branch: {
          chinese: ebMapping.chinese || ebName,
          animal: ebMapping.animal || 'Unknown',
          element: ebMapping.animal || 'Unknown',
          color: ebMapping.hex_color || '#808080'
        },
        branchName: ebName,
        stemKey: 'hs_ml',
        branchKey: 'eb_ml',
        hiddenStems: hiddenStems,
        hiddenQi: ebMonthlyNode?.base?.qi || null,
        tenGod: tenGodLabel,
        transformed: ebMonthlyNode?.transformed || false,
        isUnknown: false,
        stemAlive: hsMonthlyNode?.alive !== false,
        branchAlive: ebMonthlyNode?.alive !== false,
        stemInteracted: hsMonthlyNode?.interacted || false,
        branchInteracted: ebMonthlyNode?.interacted || false,
        stemTransformed: hsMonthlyNode?.transformed || false,
        branchTransformed: ebMonthlyNode?.transformed || false,
        stemTransformBadge: hsMonthlyNode?.transformation_badge || null,
        branchTransformBadge: ebMonthlyNode?.transformation_badge || null,
        isMonthlyLuck: true
      })
    }
  }
  
  // Extract Daily Pillar (if available)
  if (chartData.value?.analysis_info?.has_daily && chartData.value?.hs_dl && chartData.value?.eb_dl) {
    const hsDailyNode = chartData.value.hs_dl
    const ebDailyNode = chartData.value.eb_dl
    const [hsName, ebName] = [hsDailyNode.base?.id, ebDailyNode.base?.id]
    
    if (hsName && ebName) {
      const mappings = chartData.value.mappings
      const hsMapping = mappings.heavenly_stems?.[hsName] || {}
      const ebMapping = mappings.earthly_branches?.[ebName] || {}
      
      const dayMasterStem = chartData.value?.hs_d?.base?.id || 'Yi'
      const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[hsName]
      const tenGodLabel = tenGodData?.abbreviation || tenGodData?.id || ''
      
      // Map hidden stems to Ten Gods using frontend mappings (use post.qi in post view, base.qi in base view)
      const usePost = viewMode.value === 'post' || viewMode.value === 'transformed'
      const dailyQi = usePost ? (ebDailyNode?.post?.qi || ebDailyNode?.base?.qi || {}) : (ebDailyNode?.base?.qi || {})
      const hiddenStems = {}
      if (dailyQi && mappings.ten_gods) {
        for (const stemName of Object.keys(dailyQi)) {
          const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[stemName]
          hiddenStems[stemName] = tenGodData?.abbreviation || tenGodData?.id || ''
        }
      }
      
      luckPillars.push({
        label: 'Daily 日運',
        stem: {
          chinese: hsMapping.chinese || hsName,
          element: hsMapping.english || 'Unknown',
          color: hsMapping.hex_color || '#808080'
        },
        stemName: hsName,
        branch: {
          chinese: ebMapping.chinese || ebName,
          animal: ebMapping.animal || 'Unknown',
          element: ebMapping.animal || 'Unknown',
          color: ebMapping.hex_color || '#808080'
        },
        branchName: ebName,
        stemKey: 'hs_dl',
        branchKey: 'eb_dl',
        hiddenStems: hiddenStems,
        hiddenQi: ebDailyNode?.base?.qi || null,
        tenGod: tenGodLabel,
        transformed: ebDailyNode?.transformed || false,
        isUnknown: false,
        stemAlive: hsDailyNode?.alive !== false,
        branchAlive: ebDailyNode?.alive !== false,
        stemInteracted: hsDailyNode?.interacted || false,
        branchInteracted: ebDailyNode?.interacted || false,
        stemTransformed: hsDailyNode?.transformed || false,
        branchTransformed: ebDailyNode?.transformed || false,
        stemTransformBadge: hsDailyNode?.transformation_badge || null,
        branchTransformBadge: ebDailyNode?.transformation_badge || null,
        isDailyLuck: true
      })
    }
  }
  
  // Extract Hourly Pillar (if available)
  if (chartData.value?.analysis_info?.has_hourly && chartData.value?.hs_hl && chartData.value?.eb_hl) {
    const hsHourlyNode = chartData.value.hs_hl
    const ebHourlyNode = chartData.value.eb_hl
    const [hsName, ebName] = [hsHourlyNode.base?.id, ebHourlyNode.base?.id]
    
    if (hsName && ebName) {
      const mappings = chartData.value.mappings
      const hsMapping = mappings.heavenly_stems?.[hsName] || {}
      const ebMapping = mappings.earthly_branches?.[ebName] || {}
      
      const dayMasterStem = chartData.value?.hs_d?.base?.id || 'Yi'
      const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[hsName]
      const tenGodLabel = tenGodData?.abbreviation || tenGodData?.id || ''
      
      // Map hidden stems to Ten Gods using frontend mappings (use post.qi in post view, base.qi in base view)
      const usePost = viewMode.value === 'post' || viewMode.value === 'transformed'
      const hourlyQi = usePost ? (ebHourlyNode?.post?.qi || ebHourlyNode?.base?.qi || {}) : (ebHourlyNode?.base?.qi || {})
      const hiddenStems = {}
      if (hourlyQi && mappings.ten_gods) {
        for (const stemName of Object.keys(hourlyQi)) {
          const tenGodData = mappings.ten_gods?.[dayMasterStem]?.[stemName]
          hiddenStems[stemName] = tenGodData?.abbreviation || tenGodData?.id || ''
        }
      }
      
      luckPillars.push({
        label: 'Hourly 時運',
        stem: {
          chinese: hsMapping.chinese || hsName,
          element: hsMapping.english || 'Unknown',
          color: hsMapping.hex_color || '#808080'
        },
        stemName: hsName,
        branch: {
          chinese: ebMapping.chinese || ebName,
          animal: ebMapping.animal || 'Unknown',
          element: ebMapping.animal || 'Unknown',
          color: ebMapping.hex_color || '#808080'
        },
        branchName: ebName,
        stemKey: 'hs_hl',
        branchKey: 'eb_hl',
        hiddenStems: hiddenStems,
        hiddenQi: ebHourlyNode?.base?.qi || null,
        tenGod: tenGodLabel,
        transformed: ebHourlyNode?.transformed || false,
        isUnknown: false,
        stemAlive: hsHourlyNode?.alive !== false,
        branchAlive: ebHourlyNode?.alive !== false,
        stemInteracted: hsHourlyNode?.interacted || false,
        branchInteracted: ebHourlyNode?.interacted || false,
        stemTransformed: hsHourlyNode?.transformed || false,
        branchTransformed: ebHourlyNode?.transformed || false,
        stemTransformBadge: hsHourlyNode?.transformation_badge || null,
        branchTransformBadge: ebHourlyNode?.transformation_badge || null,
        isHourlyLuck: true
      })
    }
  }
  
  return luckPillars
})

// Combined ordered pillars (for backward compatibility with interaction functions)
const pillarsOrdered = computed(() => {
  if (!pillars.value) return null
  
  const basePillars = [
    pillars.value.hour,
    pillars.value.day,
    pillars.value.month,
    pillars.value.year
  ]
  
  // Use luckPillarsOrdered to get all luck pillars (10Y, annual, monthly, daily, hourly)
  const allLuckPillars = luckPillarsOrdered.value || []
  
  // Combine natal + luck pillars
  return [...basePillars, ...allLuckPillars]
})

// Old manual pillar building logic removed - now using luckPillarsOrdered
// (Simplified from 150+ lines to just using luckPillarsOrdered above)

const tenElements = computed(() => {
  // Backend now returns base_element_score and post_element_score (flat dicts with stem IDs as keys)
  if (!chartData.value?.base_element_score || !chartData.value?.post_element_score) return []
  
  const baseScores = chartData.value.base_element_score
  const postScores = chartData.value.post_element_score
  
  // Map stem IDs to display names
  const stemToDisplay = {
    'Jia': 'Yang Wood',
    'Yi': 'Yin Wood',
    'Bing': 'Yang Fire',
    'Ding': 'Yin Fire',
    'Wu': 'Yang Earth',
    'Ji': 'Yin Earth',
    'Geng': 'Yang Metal',
    'Xin': 'Yin Metal',
    'Ren': 'Yang Water',
    'Gui': 'Yin Water'
  }
  
  return Object.entries(stemToDisplay).map(([stem, displayName]) => ({
    name: displayName,
    naive: baseScores[stem] || 0,
    final: postScores[stem] || 0,
    change: (postScores[stem] || 0) - (baseScores[stem] || 0)
  }))
})

const fiveElements = computed(() => {
  // Backend now returns base_element_score and post_element_score (flat dicts with 10 stems)
  if (!chartData.value?.base_element_score || !chartData.value?.post_element_score) return []
  
  const baseScores = chartData.value.base_element_score
  const postScores = chartData.value.post_element_score
  
  // Map stems to elements and sum them up
  const stemToElement = {
    'Jia': 'Wood', 'Yi': 'Wood',
    'Bing': 'Fire', 'Ding': 'Fire',
    'Wu': 'Earth', 'Ji': 'Earth',
    'Geng': 'Metal', 'Xin': 'Metal',
    'Ren': 'Water', 'Gui': 'Water'
  }
  
  const naiveByElement = {}
  const finalByElement = {}
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  
  // Initialize
  elements.forEach(elem => {
    naiveByElement[elem] = 0
    finalByElement[elem] = 0
  })
  
  // Sum up scores by element
  Object.entries(stemToElement).forEach(([stem, element]) => {
    naiveByElement[element] += baseScores[stem] || 0
    finalByElement[element] += postScores[stem] || 0
  })
  
  return elements.map(name => ({
    name,
    naive: naiveByElement[name] || 0,
    final: finalByElement[name] || 0,
    change: (finalByElement[name] || 0) - (naiveByElement[name] || 0)
  }))
})

const fiveElementsWithRelations = computed(() => {
  if (!fiveElements.value.length) return []
  
  // If no daymaster_analysis, return elements without relationships
  if (!chartData.value?.daymaster_analysis) {
    return fiveElements.value.map(element => ({
      ...element,
      relationship: ''
    }))
  }
  
  const daymaster = chartData.value.daymaster_analysis.daymaster
  const daymasterElement = daymaster.split(' ')[1] // Get element from "Yang Fire" -> "Fire"
  
  return fiveElements.value.map(element => ({
    ...element,
    relationship: getElementRelationship(daymasterElement, element.name)
  }))
})

// Calculate totals for different views
const naiveTotal = computed(() => {
  if (!fiveElements.value.length) return 100
  return fiveElements.value.reduce((sum, e) => sum + e.naive, 0)
})

const finalTotal = computed(() => {
  if (!fiveElements.value.length) return 100
  return fiveElements.value.reduce((sum, e) => sum + e.final, 0)
})

const maxElementScore = computed(() => {
  if (!fiveElements.value.length) return 100
  // Use the maximum of naive or final totals for consistent scaling
  return Math.max(naiveTotal.value, finalTotal.value, 100)
})

const maxTenElementScore = computed(() => {
  if (!tenElements.value.length) return 100
  // Find the maximum single element score for scaling
  const maxScore = Math.max(...tenElements.value.map(e => e.final))
  return Math.max(maxScore, 100)
})

const totalChange = computed(() => {
  if (!fiveElements.value.length) return 0
  return fiveElements.value.reduce((sum, e) => sum + e.change, 0)
})

const interactions = computed(() => {
  // Handle both new format (direct interactions object) and wrapped format
  const interactionsData = chartData.value?.interactions || chartData.value?.interaction_analysis?.interactions
  if (!interactionsData) return []
  
  // If it's an object (new format), convert to array
  if (typeof interactionsData === 'object' && !Array.isArray(interactionsData)) {
    return Object.entries(interactionsData).map(([id, data]) => ({
      id,
      ...data
    }))
  }
  
  // If it's already an array, return as-is
  return interactionsData
})

const nonNaturalInteractions = computed(() => {
  if (!interactions.value || !Array.isArray(interactions.value)) return []
  return interactions.value.filter(i => {
    return !i.type?.includes('NATURAL') && !i.type?.includes('ENERGY_FLOW') && i.type !== 'SEASONAL_ADJUSTMENT'
  })
})

// Extract luck pillar interactions from backend-calculated interactions
// Backend returns interactions as a DICTIONARY (not array), with keys like "TYPE~Pattern~nodes"
const luckPillarInteractions = computed(() => {
  if (!chartData.value?.interactions || (!currentLuckPillar.value && !annualLuckPillar.value)) return []
  
  const interactionsDict = chartData.value.interactions
  const luckInteractions = []
  
  // Iterate through interaction dictionary keys
  for (const [key, interactionData] of Object.entries(interactionsDict)) {
    // Check if this interaction involves luck pillar nodes (10-year, annual, monthly, daily, hourly)
    const nodes = interactionData.nodes || []
    const hasLuckNode = nodes.some(nodeId => 
      nodeId === 'hs_10yl' || nodeId === 'eb_10yl' ||
      nodeId === 'hs_yl' || nodeId === 'eb_yl' ||
      nodeId === 'hs_ml' || nodeId === 'eb_ml' ||
      nodeId === 'hs_dl' || nodeId === 'eb_dl' ||
      nodeId === 'hs_hl' || nodeId === 'eb_hl'
    )
    
    if (hasLuckNode) {
      // Parse the key format: "TYPE~Pattern~nodes"
      const [type, pattern, nodesStr] = key.split('~')
      
      // Determine effect based on interaction type
      let effect = 'positive'
      if (type && (
        type.includes('CLASH') || 
        type.includes('HARM') || 
        type.includes('PUNISHMENT') ||
        type.includes('CONFLICT') ||
        type.includes('DESTRUCTION')
      )) {
        effect = 'negative'
      }
      
      // Get label from type
      const labelMap = {
        'SIX_HARMONIES': '六合',
        'CLASHES': '相冲',
        'HARMS': '相害',
        'PUNISHMENTS': '相刑',
        'STEM_COMBINATION': '天干合',
        'STEM_CONFLICT': '天干沖',
        'THREE_COMBINATIONS': '三合',
        'HALF_COMBINATION': '半合',
        'DESTRUCTION': '相破'
      }
      const label = labelMap[type] || type
      
      luckInteractions.push({
        type,
        label,
        description: interactionData.pattern || pattern || `${type} interaction`,
        branches: interactionData.branches || interactionData.stems || [],
        nodes,
        effect
      })
    }
  }
  
  return luckInteractions
})

// Methods
async function generateChart() {
  if (!birthDate.value) {
    if (typeof window !== 'undefined') {
      alert('Please fill in birth date')
    }
    return
  }
  
  // Use 'unknown' for birth_time when hour is unknown
  const timeParam = unknownHour.value ? 'unknown' : birthTime.value
  
  if (!timeParam && !unknownHour.value) {
    if (typeof window !== 'undefined') {
      alert('Please fill in birth time or mark as unknown')
    }
    return
  }
  
  isLoading.value = true
  try {
    // Build API URL with analyze_bazi endpoint (underscore, not hyphen)
    let apiUrl = `/api/bazi/analyze_bazi?birth_date=${birthDate.value}&birth_time=${encodeURIComponent(timeParam)}&gender=${gender.value}`
    
    // Only add analysis parameters if time travel mode is enabled (🔮 toggle is ON)
    if (showAnalysisPeriod.value) {
      // Add analysis_year to get luck pillars (default to current year if not specified)
      const yearToAnalyze = analysisYear.value || new Date().getFullYear()
      apiUrl += `&analysis_year=${yearToAnalyze}`
      
      // Add include_annual_luck parameter (controls whether annual luck affects calculations)
      apiUrl += `&include_annual_luck=${includeAnnualLuck.value}`
      
      // Only send month/day/time if toggles are enabled (respects checkbox state)
      if (analysisMonth.value && includeMonthlyLuck.value) {
        apiUrl += `&analysis_month=${analysisMonth.value}`
      }
      
      if (analysisDay.value && includeDailyLuck.value) {
        apiUrl += `&analysis_day=${analysisDay.value}`
      }
      
      if (analysisTime.value && includeHourlyLuck.value) {
        apiUrl += `&analysis_time=${encodeURIComponent(analysisTime.value)}`
      }
    }
    
    console.log('Calling analyze_bazi endpoint:', apiUrl)
    
    // Call the backend endpoint via proxy
    const response = await fetch(apiUrl)
    
    if (!response.ok) throw new Error('Chart API request failed')
    
    const data = await response.json()
    console.log('Chart data from analyze_bazi received:', data)
    chartData.value = data
    
    // Extract 10-year luck pillar info from response (if has_luck_pillar flag is true)
    if (data.analysis_info?.has_luck_pillar && data.hs_10yl && data.eb_10yl) {
      const luckHs = data.hs_10yl.base?.id
      const luckEb = data.eb_10yl.base?.id
      
      if (luckHs && luckEb) {
        currentLuckPillar.value = {
          pillar: `${luckHs} ${luckEb}`,
          hs_element: data.mappings?.heavenly_stems?.[luckHs]?.english || 'Unknown',
          eb_animal: data.mappings?.earthly_branches?.[luckEb]?.animal || 'Unknown',
          ten_god_hs: data.hs_10yl?.base?.ten_god || 'Unknown',
          ten_god_hidden: {},
          timing: (() => {
            const misc = data.hs_10yl?.misc || data.eb_10yl?.misc
            if (misc && misc.start_date && misc.end_date) {
              // Extract years from date strings (format: "YYYY-MM-DD")
              const startYear = misc.start_date.split('-')[0]
              const endYear = misc.end_date.split('-')[0]
              return {
                start_year: parseInt(startYear),
                end_year: parseInt(endYear),
                start_age: misc.start_age || 0,
                end_age: misc.end_age || 10,
                start_date: misc.start_date,
                end_date: misc.end_date
              }
            }
            // Fallback if no misc data
            return {
              start_year: data.analysis_info?.year || new Date().getFullYear(),
              end_year: (data.analysis_info?.year || new Date().getFullYear()) + 10,
              start_age: 0,
              end_age: 10
            }
          })(),
          is_current: true
        }
        console.log('10-year luck pillar extracted:', currentLuckPillar.value)
      } else {
        currentLuckPillar.value = null
      }
    } else {
      currentLuckPillar.value = null
    }
    
    // Extract annual luck pillar info from response (if year is set, even if disabled)
    if (data.analysis_info?.year && data.hs_yl && data.eb_yl) {
      const annualHs = data.hs_yl.base?.id
      const annualEb = data.eb_yl.base?.id
      
      if (annualHs && annualEb) {
        annualLuckPillar.value = {
          pillar: `${annualHs} ${annualEb}`,
          hs_element: data.mappings?.heavenly_stems?.[annualHs]?.english || 'Unknown',
          eb_animal: data.mappings?.earthly_branches?.[annualEb]?.animal || 'Unknown',
          ten_god_hs: data.hs_yl?.base?.ten_god || 'Unknown',
          ten_god_hidden: {},
          year: data.analysis_info?.year,
          is_current: true,
          disabled: data.hs_yl.disabled || false  // Track if it's disabled
        }
        console.log('Annual luck pillar extracted:', annualLuckPillar.value)
      } else {
        annualLuckPillar.value = null
      }
    } else {
      annualLuckPillar.value = null
    }
    
    console.log('chartData.value set with backend interactions, pillarsOrdered:', pillarsOrdered.value)
  } catch (error) {
    console.error('Error generating chart:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiUrl: `/api/bazi/analyze_bazi?birth_date=${birthDate.value}&birth_time=${encodeURIComponent(birthTime.value || 'unknown')}&gender=${gender.value}`
    })
    if (typeof window !== 'undefined') {
      alert(`Failed to generate chart: ${error.message || 'Unknown error'}. Check console for details.`)
    }
  } finally {
    isLoading.value = false
    console.log('isLoading set to false')
  }
}

function getElementColor(element) {
  const colorMap = {
    'Wood': 'text-green-600',
    'Yang Wood': 'text-green-700',
    'Yin Wood': 'text-green-500',
    'Fire': 'text-red-600',
    'Yang Fire': 'text-red-700',
    'Yin Fire': 'text-red-500',
    'Earth': 'text-yellow-600',
    'Yang Earth': 'text-yellow-700',
    'Yin Earth': 'text-yellow-500',
    'Metal': 'text-gray-600',
    'Yang Metal': 'text-gray-700',
    'Yin Metal': 'text-gray-500',
    'Water': 'text-blue-600',
    'Yang Water': 'text-blue-700',
    'Yin Water': 'text-blue-500'
  }
  return colorMap[element] || 'text-gray-600'
}

// Removed cyber color functions - now using getElementColor

function getElementBgColor(element) {
  const colorMap = {
    'Wood': 'bg-green-500',
    'Fire': 'bg-red-500',
    'Earth': 'bg-yellow-500',
    'Metal': 'bg-gray-500',
    'Water': 'bg-blue-500'
  }
  return colorMap[element] || 'bg-gray-400'
}

// Get node background color using hex colors from API
function getNodeBgColor(elementWithPolarity, apiHexColor = null) {
  // If API provided a hex color, use it directly
  if (apiHexColor) {
    // Handle pure element colors (gradient object)
    if (typeof apiHexColor === 'object' && apiHexColor.bg) {
      // For pure elements, return a special gradient
      if (apiHexColor.bg.includes('gradient')) {
        return { 
          background: 'linear-gradient(to right, #ef4444, #a855f7, #ec4899)',
          border: '2px solid #9333ea'
        }
      }
    }
    
    // Use hex color directly from API
    if (typeof apiHexColor === 'string' && apiHexColor.startsWith('#')) {
      return { backgroundColor: apiHexColor }
    }
  }
  
  // Fallback to element-based colors
  const colorMap = {
    'Yang Wood': '#c2d4be',
    'Yin Wood': '#d6e2bb',
    'Yang Fire': '#f3adae',
    'Yin Fire': '#f5d3b0',
    'Yang Earth': '#e6ceb7',
    'Yin Earth': '#efe3cc',
    'Yang Metal': '#ccd8e6',
    'Yin Metal': '#e6e8f7',
    'Yang Water': '#b9cbff',
    'Yin Water': '#e0e9ff'
  }
  
  const bgColor = colorMap[elementWithPolarity] || '#f9fafb'
  return { backgroundColor: bgColor }
}

// Get element for a stem name
function getStemElement(stemName) {
  const stemElements = {
    'Jia': 'Yang Wood', 'Yi': 'Yin Wood',
    'Bing': 'Yang Fire', 'Ding': 'Yin Fire',
    'Wu': 'Yang Earth', 'Ji': 'Yin Earth',
    'Geng': 'Yang Metal', 'Xin': 'Yin Metal',
    'Ren': 'Yang Water', 'Gui': 'Yin Water'
  }
  return stemElements[stemName] || ''
}


// Get hidden stems with proportional weights based on qi scores
function getHiddenStemsWithWeights(pillar) {
  // Get the appropriate qi data based on view mode
  const ebNode = nodes.value?.[pillar.branchKey]
  
  // Use base qi in base mode, post qi in other modes
  let qiData = null
  if (viewMode.value === 'base' && ebNode?.base?.qi) {
    // Use initial qi for base view
    qiData = ebNode.base.qi
  } else if (ebNode?.post?.qi) {
    // Use post qi for post-interaction and transformed views
    qiData = ebNode.post.qi
  } else if (ebNode?.base?.qi) {
    // Fallback to base qi if post qi not available
    qiData = ebNode.base.qi
  } else if (pillar.hiddenQi) {
    // Fallback to pillar.hiddenQi (could be object or array)
    qiData = pillar.hiddenQi
  }
  
  // Handle both object format {Yi: 100.0, Jia: 20.0} and array format
  if (qiData) {
    // Convert object to array format if needed
    let qiArray = []
    if (Array.isArray(qiData)) {
      qiArray = qiData
    } else if (typeof qiData === 'object') {
      // Convert {Yi: 100.0, Jia: 20.0} to [{stem: 'Yi', score: 100.0}, ...]
      qiArray = Object.entries(qiData).map(([stem, score]) => ({
        stem,
        score,
        count: 1
      }))
    }
    
  if (qiArray && qiArray.length > 0) {
    const result = {}
    const totalScore = qiArray.reduce((sum, qi) => sum + qi.score, 0)
    
    for (const qi of qiArray) {
      const percentage = Math.round((qi.score / totalScore) * 100)
      // Get ten god for this stem if available
      // Handle both string format and object format
      const tenGodData = pillar.hiddenStems?.[qi.stem]
      const tenGod = typeof tenGodData === 'string' 
        ? tenGodData 
        : tenGodData?.abbreviation || tenGodData?.id || ''
      // Use hex color from API if available, fallback to color, then null
      const stemColor = qi.hex_color || qi.color || null
      result[qi.stem] = { 
        god: tenGod, 
        weight: percentage,
        score: qi.score,
        count: qi.count,
        color: stemColor
      }
    }
    return result
  }
  }
  
  // Fallback to old method using hiddenStems with hardcoded percentages
  if (!pillar.hiddenStems) return {}
  
  // Hardcoded hidden stem percentages based on BaZi traditional values
  // These match the backend's EARTHLY_BRANCH_HIDDEN_QI definitions
  const hiddenStemPercentages = {
    'Zi': { 'Gui': 100 },
    'Chou': { 'Ji': 60, 'Gui': 30, 'Xin': 10 },
    'Yin': { 'Jia': 60, 'Bing': 30, 'Wu': 10 },
    'Mao': { 'Yi': 100 },
    'Chen': { 'Wu': 60, 'Yi': 30, 'Gui': 10 },
    'Si': { 'Bing': 60, 'Wu': 30, 'Geng': 10 },
    'Wu': { 'Ding': 70, 'Ji': 30 },
    'Wei': { 'Ji': 60, 'Ding': 30, 'Yi': 10 },
    'Shen': { 'Geng': 60, 'Ren': 30, 'Wu': 10 },
    'You': { 'Xin': 100 },
    'Xu': { 'Wu': 60, 'Xin': 30, 'Ding': 10 },
    'Hai': { 'Ren': 70, 'Jia': 30 }
  }
  
  // Get the original branch name (before any transformation)
  const branchName = pillar.branchName
  const branchPercentages = hiddenStemPercentages[branchName]
  
  if (!branchPercentages) {
    // Fallback: distribute evenly if branch not found
    const stems = Object.entries(pillar.hiddenStems)
    const result = {}
    const evenWeight = Math.floor(100 / stems.length)
    for (const [stem, tenGod] of stems) {
      result[stem] = { god: tenGod, weight: evenWeight }
    }
    return result
  }
  
  // Use the hardcoded percentages
  const result = {}
  for (const [stem, tenGod] of Object.entries(pillar.hiddenStems)) {
    const percentage = branchPercentages[stem] || 33 // Default if not found
    result[stem] = { god: tenGod, weight: percentage }
  }
  
  return result
}

function getElementBorderColor(element) {
  const colorMap = {
    'Wood': 'border-green-500',
    'Fire': 'border-red-500',
    'Earth': 'border-yellow-500',
    'Metal': 'border-gray-500',
    'Water': 'border-blue-500'
  }
  return colorMap[element] || 'border-gray-400'
}

function getInteractionBorderColor(type) {
  if (type.includes('NATURAL')) return 'border-purple-400'
  if (type.includes('CONFLICT') || type.includes('CLASH') || type.includes('HARM') || type.includes('DESTRUCTION') || type.includes('PUNISHMENT')) return 'border-red-400'
  if (type.includes('COMBINATION') || type.includes('HARMONY')) return 'border-green-400'
  if (type.includes('MEETING')) return 'border-blue-400'
  return 'border-gray-400'
}

// Get subtle left border class for log entries
function getLogBorderClass(type) {
  if (type.includes('NATURAL')) return 'border-l-4 border-l-purple-300'
  if (type.includes('CONFLICT') || type.includes('CLASH') || type.includes('HARM') || type.includes('DESTRUCTION') || type.includes('PUNISHMENT')) return 'border-l-4 border-l-red-300'
  if (type.includes('COMBINATION') || type.includes('HARMONY')) return 'border-l-4 border-l-green-300'
  if (type.includes('MEETING')) return 'border-l-4 border-l-blue-300'
  return 'border-l-4 border-l-gray-300'
}

function getInteractionTextColor(type) {
  if (type.includes('NATURAL')) return 'text-purple-700'
  if (type.includes('CONFLICT') || type.includes('CLASH') || type.includes('HARM') || type.includes('DESTRUCTION') || type.includes('PUNISHMENT')) return 'text-red-700'
  if (type.includes('COMBINATION') || type.includes('HARMONY')) return 'text-green-700'
  if (type.includes('MEETING')) return 'text-blue-700'
  return 'text-gray-700'
}

function formatInteractionType(type) {
  const typeMap = {
    'THREE_MEETINGS': '三會 Three Meetings',
    'PUNISHMENTS': '相刑 Punishments',
    'THREE_COMBINATIONS': '三合 Three Combinations',
    'SIX_HARMONIES': '六合 Six Harmonies',
    'HALF_COMBINATIONS': '半合 Half Combinations',
    'HALF_COMBINATION': '半合 Half Combination',
    'ARCHED_COMBINATIONS': '拱合 Arched Combinations',
    'CLASHES': '沖 Clashes',
    'HARMS': '害 Harms',
    'DESTRUCTIONS': '破 Destructions',
    'DESTRUCTION': '破 Destruction',
    'HS_CONFLICT': '天干沖 Stem Conflicts',
    'STEM_CONFLICT': '天干沖 Stem Conflict',
    'HS_COMBINATION': '天干合 Stem Combinations',
    'STEM_COMBINATION': '天干合 Stem Combination',
    'NATURAL_GENERATING': '生 Energy Flow (Generation)',
    'NATURAL_CONTROLLING': '剋 Energy Flow (Control)',
    'ENERGY_FLOW_GENERATING': '生 Energy Flow (Generation)',
    'ENERGY_FLOW_CONTROLLING': '剋 Energy Flow (Control)',
    'ENERGY_FLOW': '氣 Energy Flow',
    'SEASONAL_ADJUSTMENT': '季節調整 Seasonal Adjustment'
  }
  return typeMap[type] || type
}

function formatInteractionDescription(interaction) {
  if (interaction.description) return interaction.description
  
  if (interaction.type === 'HS_CONFLICT' && interaction.conflictor) {
    return `${interaction.conflictor.stem} (conflictor, -${interaction.conflictor.reduction}%) conflicts with ${interaction.conflicted.stem} (conflicted, -${interaction.conflicted.reduction}%)`
  }
  
  if (interaction.relationship) return interaction.relationship
  
  if (interaction.branches) {
    return `Branches: ${interaction.branches.join(', ')}`
  }
  
  if (interaction.stems) {
    return `Stems: ${interaction.stems.join(', ')}`
  }
  
  return ''
}

// Get pre/post element scores for an interaction
function getInteractionElementScores(interaction) {
  if (!chartData.value) return null
  
  // Get base (pre) and post element scores from chartData
  const baseScores = chartData.value.base_element_score || {}
  const postScores = chartData.value.post_element_score || {}
  
  // If no element changes in this interaction, return null
  if (!interaction.element_changes || Object.keys(interaction.element_changes).length === 0) {
    return null
  }
  
  // Build scores object for affected elements
  const scores = {}
  const fiveElements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  
  for (const element of fiveElements) {
    // Get all stems for this element from baseScores
    const stemIds = Object.keys(baseScores).filter(stemId => {
      const mapping = chartData.value.mappings?.heavenly_stems?.[stemId]
      if (!mapping) return false
      const stemElement = mapping.english || ''
      // Match "Yang Fire" or "Yin Fire" to "Fire"
      return stemElement.includes(element)
    })
    
    // Sum up scores for this element
    let preTotal = 0
    let postTotal = 0
    
    for (const stemId of stemIds) {
      preTotal += baseScores[stemId] || 0
      postTotal += postScores[stemId] || 0
    }
    
    // Only include if there's a change
    const change = postTotal - preTotal
    if (Math.abs(change) > 0.1) {  // Small threshold to avoid floating point noise
      scores[element] = {
        pre: preTotal,
        post: postTotal,
        change: change
      }
    }
  }
  
  return Object.keys(scores).length > 0 ? scores : null
}

function formatNodeName(node) {
  const nodeMap = {
    'hs_y': 'Year Stem',
    'hs_m': 'Month Stem',
    'hs_d': 'Day Stem',
    'hs_h': 'Hour Stem',
    'hs_10yl': '10-Year Luck Stem',
    'hs_yl': 'Annual Luck Stem',
    'hs_ml': 'Monthly Luck Stem',
    'hs_dl': 'Daily Luck Stem',
    'hs_hl': 'Hourly Luck Stem',
    'eb_y': 'Year Branch',
    'eb_m': 'Month Branch',
    'eb_d': 'Day Branch',
    'eb_h': 'Hour Branch',
    'eb_10yl': '10-Year Luck Branch',
    'eb_yl': 'Annual Luck Branch',
    'eb_ml': 'Monthly Luck Branch',
    'eb_dl': 'Daily Luck Branch',
    'eb_hl': 'Hourly Luck Branch'
  }
  return nodeMap[node] || node
}

function getPillarPosition(position) {
  const positions = ['Year', 'Month', 'Day', 'Hour', '10-Year Luck', 'Annual Luck', 'Monthly Luck', 'Daily Luck', 'Hourly Luck']
  return positions[position] || position
}

function getTenGodLabel(element) {
  if (!chartData.value?.daymaster_analysis) return ''
  
  const daymaster = chartData.value.daymaster_analysis.daymaster
  const daymasterElement = daymaster.split(' ')[1] // Get element part
  const daymasterPolarity = daymaster.split(' ')[0] // Get polarity (Yang/Yin)
  const elementName = element.split(' ')[1] // Get element part
  const elementPolarity = element.split(' ')[0] // Get polarity
  
  // WuXing cycle: Wood -> Fire -> Earth -> Metal -> Water -> Wood
  const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  const dmIndex = cycle.indexOf(daymasterElement)
  const elIndex = cycle.indexOf(elementName)
  
  // Calculate relationship distance
  const distance = (elIndex - dmIndex + 5) % 5
  
  // Determine Ten God based on distance and polarity match
  const polarityMatch = daymasterPolarity === elementPolarity
  
  switch(distance) {
    case 0: // Same element
      return polarityMatch ? '比肩 Friend' : '劫財 Rob Wealth'
    case 1: // Element I generate (child)
      return polarityMatch ? '食神 Eating God' : '傷官 Hurting Officer'
    case 2: // Element that generates my child (wealth)
      return polarityMatch ? '偏財 Indirect Wealth' : '正財 Direct Wealth'
    case 3: // Element that controls me (officer)
      return polarityMatch ? '偏官 Seven Killings' : '正官 Direct Officer'
    case 4: // Element that generates me (resource)
      return polarityMatch ? '偏印 Indirect Resource' : '正印 Direct Resource'
    default:
      return ''
  }
}

function getElementRelationship(daymasterElement, element) {
  // WuXing cycle relationships
  const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  const dmIndex = cycle.indexOf(daymasterElement)
  const elIndex = cycle.indexOf(element)
  
  const distance = (elIndex - dmIndex + 5) % 5
  
  switch(distance) {
    case 0:
      return 'Self/Companion'
    case 1:
      return 'Output/Expression'
    case 2:
      return 'Wealth'
    case 3:
      return 'Officer/Status'
    case 4:
      return 'Resource/Support'
    default:
      return ''
  }
}

// Interactive handlers
function handleNodeHover(nodeId, nodeKey) {
  hoveredNode.value = nodeId
  highlightedNodes.value = []
  
  // Find interactions involving this node
  const nodeInteractions = getNodeInteractions(nodeKey)
  
  // Highlight connected nodes
  nodeInteractions.forEach(interaction => {
    if (interaction.nodes) {
      interaction.nodes.forEach(node => {
        if (node !== nodeKey) {
          const nodeIndex = getNodeIndex(node)
          if (nodeIndex !== -1) {
            const nodeType = node.startsWith('hs') ? 'stem' : 'branch'
            highlightedNodes.value.push(`${nodeType}-${nodeIndex}`)
          }
        }
      })
    }
  })
  
  // Show tooltip
  if (nodeInteractions.length > 0) {
    const event = window.event
    tooltipContent.value = {
      title: `${nodeInteractions.length} Interactions`,
      description: nodeInteractions.map(i => formatShortInteraction(i)).join(', '),
      effect: nodeInteractions.some(i => i.effect === 'High') ? 'Strong influence' : 'Moderate influence'
    }
    tooltipPosition.value = {
      x: event.pageX + 10,
      y: event.pageY - 50
    }
  }
}

function handleNodeLeave() {
  hoveredNode.value = null
  highlightedNodes.value = []
  tooltipContent.value = null
}

function handleInteractionHover(interaction) {
  hoveredInteraction.value = interaction.id
  highlightedNodes.value = []
  
  // Highlight nodes involved in this interaction
  if (interaction.nodes) {
    interaction.nodes.forEach(node => {
      const nodeIndex = getNodeIndex(node)
      if (nodeIndex !== -1) {
        const nodeType = node.startsWith('hs') ? 'stem' : 'branch'
        highlightedNodes.value.push(`${nodeType}-${nodeIndex}`)
      }
    })
  }
  
  // Show detailed tooltip
  const event = window.event
  tooltipContent.value = {
    title: formatInteractionType(interaction.type),
    description: formatInteractionDescription(interaction),
    effect: interaction.effect || 'Modifies element energies'
  }
  tooltipPosition.value = {
    x: event.pageX + 10,
    y: event.pageY - 50
  }
}

function getTransformBadgeDisplay(badge) {
  if (!badge) return ''
  
  // Map stem IDs to their Chinese characters
  const stemToChinese = {
    'Jia': '甲', 'Yi': '乙', 'Bing': '丙', 'Ding': '丁',
    'Wu': '戊', 'Ji': '己', 'Geng': '庚', 'Xin': '辛',
    'Ren': '壬', 'Gui': '癸'
  }
  
  // Map pure elements to their Chinese characters
  const elementToChinese = {
    'Wood': '木', 'Fire': '火', 'Earth': '土',
    'Metal': '金', 'Water': '水'
  }
  
  // Check if it's a stem ID
  if (stemToChinese[badge]) {
    return stemToChinese[badge]
  }
  
  // Check if it's a pure element
  if (elementToChinese[badge]) {
    return elementToChinese[badge]
  }
  
  // If it contains 'Yang' or 'Yin', extract the element part
  if (badge.includes('Yang') || badge.includes('Yin')) {
    const element = badge.replace('Yang ', '').replace('Yin ', '')
    return elementToChinese[element] || badge
  }
  
  // Default: return as is
  return badge
}

function getTransformBadgeStyle(badge) {
  if (!badge) return {}
  
  // Map stem IDs and elements to their hex colors from the mappings
  const badgeColors = {
    // Heavenly Stems colors
    'Jia': '#c2d4be',    // Yang Wood - Light sage green
    'Yi': '#d6e2bb',     // Yin Wood - Light lime green
    'Bing': '#f3adae',   // Yang Fire - Light coral red
    'Ding': '#f5d3b0',   // Yin Fire - Light peach
    'Wu': '#e6ceb7',     // Yang Earth - Light tan
    'Ji': '#efe3cc',     // Yin Earth - Light cream
    'Geng': '#ccd8e6',   // Yang Metal - Light steel blue
    'Xin': '#e6e8f7',    // Yin Metal - Light lavender
    'Ren': '#b9cbff',    // Yang Water - Light sky blue
    'Gui': '#e0e9ff',    // Yin Water - Light powder blue
    // Pure Elements
    'Wood': '#c9dcc4',   // Average of wood colors
    'Fire': '#f4c0af',   // Average of fire colors
    'Earth': '#ead9c2',  // Average of earth colors
    'Metal': '#d9e0f2',  // Average of metal colors
    'Water': '#cdd5ff',  // Average of water colors
    // Yang/Yin Elements
    'Yang Wood': '#c2d4be',
    'Yin Wood': '#d6e2bb',
    'Yang Fire': '#f3adae',
    'Yin Fire': '#f5d3b0',
    'Yang Earth': '#e6ceb7',
    'Yin Earth': '#efe3cc',
    'Yang Metal': '#ccd8e6',
    'Yin Metal': '#e6e8f7',
    'Yang Water': '#b9cbff',
    'Yin Water': '#e0e9ff'
  }
  
  const bgColor = badgeColors[badge] || '#fbbf24' // Default to yellow if not found
  
  // Calculate a darker text color for contrast
  const textColor = getLightnessPercent(bgColor) > 70 ? '#1f2937' : '#ffffff'
  
  return {
    backgroundColor: bgColor,
    color: textColor,
    border: `2px solid ${adjustBrightness(bgColor, -20)}`,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }
}

// Helper function to calculate lightness percentage
function getLightnessPercent(hexColor) {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 * 100
}

// Helper function to adjust brightness
function adjustBrightness(hexColor, percent) {
  const hex = hexColor.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + percent * 2.55))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + percent * 2.55))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + percent * 2.55))
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
}

function handleInteractionLeave() {
  hoveredInteraction.value = null
  highlightedNodes.value = []
  tooltipContent.value = null
}

function getNodeInteractions(nodeKey) {
  if (!interactions.value) return []
  return interactions.value.filter(i => i.nodes && i.nodes.includes(nodeKey))
}

function getNonNaturalInteractions(nodeKey) {
  if (!interactions.value) return []
  return interactions.value.filter(i => {
    if (!i.nodes || !i.nodes.includes(nodeKey)) return false
    return !i.type.includes('NATURAL')
  })
}

function getPillarInteractions(pillarIndex) {
  const pillarMap = { 0: 'h', 1: 'd', 2: 'm', 3: 'y' } // Hour, Day, Month, Year order (left to right)
  const pillarKey = pillarMap[pillarIndex]
  if (!pillarKey) return []
  
  return interactions.value.filter(i => {
    // Filter out only natural interactions and seasonal adjustments
    if (i.type && (i.type.includes('NATURAL') || i.type === 'SEASONAL_ADJUSTMENT')) return false
    
    // Check if this interaction involves the current pillar
    // For HS_CONFLICT, check conflictor and conflicted nodes
    if (i.type === 'HS_CONFLICT') {
      return (i.conflictor?.node?.includes(`_${pillarKey}`) || 
              i.conflicted?.node?.includes(`_${pillarKey}`))
    }
    
    // For other interactions, check nodes array
    if (!i.nodes) return false
    return i.nodes.some(n => n.includes(`_${pillarKey}`))
  })
}

function getPillarInteractionData(pillarIndex) {
  const results = []
  
  // Map pillar index to node position codes: 0=h, 1=d, 2=m, 3=y, 4=10yl, 5=yl, 6=ml, 7=dl, 8=hl
  const indexToNodePos = {
    0: 'h',    // Hour
    1: 'd',    // Day
    2: 'm',    // Month
    3: 'y',    // Year
    4: '10yl',  // 10-Year Luck
    5: 'yl',   // Annual Luck
    6: 'ml',   // Monthly Luck
    7: 'dl',   // Daily Luck
    8: 'hl'    // Hourly Luck
  }
  
  const currentNodePos = indexToNodePos[pillarIndex]
  if (!currentNodePos) return []
  
  // Get all interactions involving this pillar
  if (!interactions.value) return results
  
  for (const [key, interaction] of Object.entries(chartData.value?.interactions || {})) {
      // Skip energy flow and seasonal adjustments
      if (interaction.type?.includes('ENERGY_FLOW') || 
          interaction.type === 'SEASONAL_ADJUSTMENT') {
        continue
      }
      
      // Check if this pillar is involved in the interaction
      const nodes = interaction.nodes || []
      const isPillarInvolved = nodes.some(nodeId => {
        // Extract position from node ID (e.g., "hs_y" -> "y", "eb_10yl" -> "10yl")
        const parts = nodeId.split('_')
        const nodePos = parts.length > 2 ? parts.slice(1).join('_') : parts[1]
        return nodePos === currentNodePos
      })
      
      if (!isPillarInvolved) continue
      
      // Build interaction display data
      const interactionObj = {
        type: interaction.type,
        pattern: interaction.pattern,
        nodes: nodes,
        positions: interaction.positions || [],
        effect: 'neutral',
        isLuckInteraction: nodes.some(n => n.includes('_10yl') || n.includes('_yl')),
        display: '',
        subtitle: '',
        raw: interaction
      }
      
      // Determine effect (positive/negative)
      if (interaction.type && (
        interaction.type.includes('CLASH') || 
        interaction.type.includes('HARM') || 
        interaction.type.includes('PUNISHMENT') ||
        interaction.type.includes('CONFLICT') ||
        interaction.type.includes('DESTRUCTION')
      )) {
        interactionObj.effect = 'negative'
      } else if (interaction.type && (
        interaction.type.includes('HARMONY') ||
        interaction.type.includes('COMBINATION')
      )) {
        interactionObj.effect = 'positive'
      }
      
      // Build display text
      const typeDisplay = formatInteractionType(interaction.type)
      if (interaction.pattern) {
        interactionObj.display = `${typeDisplay}: ${interaction.pattern}`
      } else {
        interactionObj.display = typeDisplay
      }
      
      // Build subtitle showing other involved pillars
      const otherPillars = nodes.filter(nodeId => {
        const parts = nodeId.split('_')
        const nodePos = parts.length > 2 ? parts.slice(1).join('_') : parts[1]
        return nodePos !== currentNodePos
      }).map(nodeId => formatNodeName(nodeId))
      
      if (otherPillars.length > 0) {
        interactionObj.subtitle = `with ${otherPillars.join(', ')}`
      }
      
    results.push(interactionObj)
  }
  
  return results
}

function getPillarInteractionText(pillarIndex) {
  if (!interactions.value) return ''
  const pillarInteractions = getPillarInteractions(pillarIndex)
  if (!pillarInteractions || !pillarInteractions.length) return ''
  
  const interactionTexts = pillarInteractions.map(interaction => {
    // Format interaction based on type with both Chinese and English
    const typeMap = {
      'THREE_MEETINGS': { zh: '三會', en: 'Three Meetings' },
      'PUNISHMENTS': { zh: '相刑', en: 'Punishment' },
      'THREE_COMBINATIONS': { zh: '三合', en: 'Three Comb.' }, 
      'SIX_HARMONIES': { zh: '六合', en: 'Six Harm.' },
      'HALF_COMBINATIONS': { zh: '半合', en: 'Half Comb.' },
      'ARCHED_COMBINATIONS': { zh: '拱合', en: 'Arch Comb.' },
      'CLASHES': { zh: '相沖', en: 'Clash' },
      'HARMS': { zh: '相害', en: 'Harm' },
      'DESTRUCTIONS': { zh: '相破', en: 'Destruction' },
      'HS_CONFLICT': { zh: '天干沖', en: 'Stem Conflict' },
      'HS_COMBINATION': { zh: '天干合', en: 'Stem Comb.' }
    }
    
    const typeInfo = typeMap[interaction.type] || { zh: interaction.type, en: interaction.type }
    
    // Get involved pillars/branches/stems with Chinese characters
    let participants = ''
    if (interaction.branches && interaction.branches.length) {
      // Map branch names to Chinese characters using existing EARTHLY_BRANCHES
      const branchesZh = interaction.branches.map(b => EARTHLY_BRANCHES[b]?.chinese || b).join('')
      participants = `/ ${typeInfo.en} / ${typeInfo.zh} (${branchesZh})`
    } else if (interaction.stems && interaction.stems.length) {
      // Map stem names to Chinese characters using existing stemMappings
      const stemsZh = interaction.stems.map(s => stemMappings[s] || s).join('')
      participants = `/ ${typeInfo.en} / ${typeInfo.zh} (${stemsZh})`
    } else if (interaction.pattern) {
      participants = `/ ${typeInfo.en} / ${typeInfo.zh}`
    } else {
      participants = `${typeInfo.en} / ${typeInfo.zh}`
    }
    
    return participants
  })
  
  return interactionTexts.join(',<br/>')
}

// Branch mappings already defined above as branchMappings in EARTHLY_BRANCHES

// Get energy flow between nodes based on API interactions
function getEnergyFlowBetweenNodes(node1, node2, isHeavenlyStem = false) {
  if (!interactions.value || !node1 || !node2) return null
  
  // Look for ENERGY_FLOW interactions that involve these nodes
  for (const interaction of interactions.value) {
    if (!interaction.type?.includes('ENERGY_FLOW')) continue
    
    const desc = interaction.description || ''
    
    // Check if this interaction involves our nodes
    if (desc.includes(node1) && desc.includes(node2)) {
      if (interaction.type === 'ENERGY_FLOW_GENERATING') {
        // Check direction from description
        if (desc.includes(`${node1} exhausts`) || desc.includes(`${node1} uses`)) {
          return '→' // node1 generates for node2
        } else if (desc.includes(`${node2} exhausts`) || desc.includes(`${node2} uses`)) {
          return '←' // node2 generates for node1
        }
      } else if (interaction.type === 'ENERGY_FLOW_CONTROLLING') {
        // Check direction from description
        if (desc.includes(`${node1} uses energy`) && desc.includes(`control ${node2}`)) {
          return '⇢' // node1 controls node2
        } else if (desc.includes(`${node2} uses energy`) && desc.includes(`control ${node1}`)) {
          return '⇠' // node2 controls node1
        }
      }
    }
  }
  
  return null
}

function getWuXingRelation(element1, element2) {
  // Extract base element names (remove Yang/Yin)
  const elem1 = element1.split(' ').pop()
  const elem2 = element2.split(' ').pop()
  
  const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  const idx1 = cycle.indexOf(elem1)
  const idx2 = cycle.indexOf(elem2)
  
  if (idx1 === -1 || idx2 === -1) return null
  
  // Check if elem1 generates elem2
  if ((idx1 + 1) % 5 === idx2) {
    return '→' // Generation arrow
  }
  
  // Check if elem1 controls elem2
  if ((idx1 + 2) % 5 === idx2) {
    return '⇢' // Control arrow pointing right
  }
  
  // Check if elem2 generates elem1
  if ((idx2 + 1) % 5 === idx1) {
    return '←' // Being generated (reverse arrow)
  }
  
  // Check if elem2 controls elem1
  if ((idx2 + 2) % 5 === idx1) {
    return '⇠' // Being controlled arrow pointing left
  }
  
  return null
}

function getWuXingRelationClass(element1, element2) {
  const relation = getWuXingRelation(element1, element2)
  
  switch(relation) {
    case '→': // Generation forward
    case '←': // Generation backward
      return 'text-green-600'
    case '⇢': // Control right
    case '⇠': // Control left
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}


function getVerticalWuXingRelation(stemElement, branchElement) {
  // Extract base element names (remove Yang/Yin)
  const stem = stemElement.split(' ').pop()
  const branch = branchElement.split(' ').pop()
  
  const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  const stemIdx = cycle.indexOf(stem)
  const branchIdx = cycle.indexOf(branch)
  
  if (stemIdx === -1 || branchIdx === -1) return null
  
  // Check if stem generates branch (energy flows down)
  if ((stemIdx + 1) % 5 === branchIdx) {
    return '↓' // Down arrow - stem generating branch
  }
  
  // Check if stem controls branch (energy suppresses down)
  if ((stemIdx + 2) % 5 === branchIdx) {
    return '⇣' // Control arrow pointing down
  }
  
  // Check if branch generates stem (energy flows up)
  if ((branchIdx + 1) % 5 === stemIdx) {
    return '↑' // Up arrow - branch generating stem
  }
  
  // Check if branch controls stem (energy suppresses up)
  if ((branchIdx + 2) % 5 === stemIdx) {
    return '⇡' // Control arrow pointing up
  }
  
  return null
}

function getVerticalWuXingClass(stemElement, branchElement) {
  const relation = getVerticalWuXingRelation(stemElement, branchElement)
  
  switch(relation) {
    case '↓': // Stem generating branch (down)
    case '↑': // Branch generating stem (up)
      return 'text-green-600'
    case '⇣': // Control down
    case '⇡': // Control up
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

function getNodeIndex(nodeKey) {
  // Map to display order: Hour, Day, Month, Year, 10Y Luck, Annual, Monthly, Daily, Hourly (left to right)
  const pillarMap = { 'h': 0, 'd': 1, 'm': 2, 'y': 3, '10yl': 4, 'yl': 5, 'ml': 6, 'dl': 7, 'hl': 8 }
  
  // Extract pillar type from node ID (e.g., "hs_h" -> "h", "eb_10yl" -> "10yl", "hs_yl" -> "yl", "hs_ml" -> "ml")
  const parts = nodeKey.split('_')
  const pillarType = parts.length > 2 ? parts.slice(1).join('_') : parts[1]
  
  return pillarMap[pillarType] ?? -1
}

function formatShortInteraction(interaction) {
  const typeMap = {
    'THREE_MEETINGS': '三會',
    'PUNISHMENTS': '刑',
    'THREE_COMBINATIONS': '三合',
    'SIX_HARMONIES': '六合',
    'HALF_COMBINATIONS': '半合',
    'ARCHED_COMBINATIONS': '拱合',
    'CLASHES': '沖',
    'HARMS': '害',
    'DESTRUCTIONS': '破',
    'HS_CONFLICT': '天干沖',
    'HS_COMBINATION': '天干合',
    'NATURAL_GENERATING': '生',
    'NATURAL_CONTROLLING': '剋'
  }
  return typeMap[interaction.type] || interaction.type
}

// Interaction highlighting functions
function highlightInteraction(interaction) {
  highlightedInteraction.value = interaction
  highlightedNodes.value = []
  
  // Highlight nodes in the chart based on interaction
  if (interaction.type === 'HS_CONFLICT') {
    // For HS_CONFLICT, add both conflictor and conflicted nodes
    if (interaction.conflictor?.node) {
      const nodeIndex = getNodeIndex(interaction.conflictor.node)
      if (nodeIndex !== -1) {
        highlightedNodes.value.push(`stem-${nodeIndex}`)
      }
    }
    if (interaction.conflicted?.node) {
      const nodeIndex = getNodeIndex(interaction.conflicted.node)
      if (nodeIndex !== -1) {
        highlightedNodes.value.push(`stem-${nodeIndex}`)
      }
    }
  } else if (interaction.nodes) {
    // For other interactions, use the nodes array
    interaction.nodes.forEach(node => {
      const nodeIndex = getNodeIndex(node)
      if (nodeIndex !== -1) {
        const nodeType = node.startsWith('hs') ? 'stem' : 'branch'
        highlightedNodes.value.push(`${nodeType}-${nodeIndex}`)
      }
    })
  }
}

function clearHighlight() {
  highlightedInteraction.value = null
  highlightedNodes.value = []
}

// Highlight interaction from log entry (reuses existing highlight logic)
function highlightInteractionFromLog(interaction) {
  highlightInteraction(interaction)
}

function isInteractionHighlighted(interaction) {
  // Check if this interaction is highlighted
  const current = highlightedInteraction.value
  if (!current) return false
  
  // Direct reference match
  if (current === interaction) return true
  
  // Special handling for HS_CONFLICT - match if same stems are involved
  if (current.type === 'HS_CONFLICT' && interaction.type === 'HS_CONFLICT') {
    // Get the stems involved in both interactions
    const currentStems = []
    if (current.conflictor?.node) currentStems.push(current.conflictor.node)
    if (current.conflicted?.node) currentStems.push(current.conflicted.node)
    
    const interactionStems = []
    if (interaction.conflictor?.node) interactionStems.push(interaction.conflictor.node)
    if (interaction.conflicted?.node) interactionStems.push(interaction.conflicted.node)
    
    // Check if they involve the same stems (regardless of order)
    const currentSorted = currentStems.sort().join(',')
    const interactionSorted = interactionStems.sort().join(',')
    return currentSorted === interactionSorted
  }
  
  // Check if they have the same nodes (for highlighting related boxes)
  if (current.nodes && interaction.nodes) {
    const currentNodes = current.nodes.sort().join(',')
    const interactionNodes = interaction.nodes.sort().join(',')
    return currentNodes === interactionNodes
  }
  
  return false
}
</script>

<style scoped>
/* Hide the clock icon in time input */
.hour-input-no-icon::-webkit-calendar-picker-indicator {
  display: none;
}
.hour-input-no-icon::-webkit-inner-spin-button,
.hour-input-no-icon::-webkit-clear-button {
  display: none;
}
/* For Firefox */
.hour-input-no-icon {
  -moz-appearance: textfield;
}
</style>