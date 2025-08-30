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
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- BaZi Chart with Integrated Input -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Chart Grid with Input Fields -->
        <div class="w-full">
          <!-- Input Fields Above Pillars -->
          <div class="grid grid-cols-4 gap-4 mb-4 max-w-lg">
            <!-- Hour Input -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1 text-center">Hour</label>
              <div class="relative">
                <input
                  v-if="!unknownHour"
                  v-model="birthTime"
                  type="time"
                  tabindex="1"
                  class="w-full px-2 py-1 pr-8 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center hour-input-no-icon"
                  @change="handleInputChange"
                />
                <input
                  v-else
                  value=""
                  disabled
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100 text-center text-gray-500"
                />
                <button
                  @click="unknownHour = !unknownHour; handleUnknownHourChange()"
                  tabindex="2"
                  :class="[
                    'absolute right-1 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs border rounded transition-colors',
                    unknownHour 
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  ]"
                  title="Toggle unknown hour"
                >
                  ?
                </button>
              </div>
            </div>
            <!-- Day Input -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1 text-center">Day</label>
              <input
                v-model="dayInput"
                type="number"
                min="1"
                max="31"
                placeholder="DD"
                tabindex="3"
                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                @change="handleInputChange"
              />
              <!-- Gender Radio Buttons -->
              <div class="flex justify-center mt-2 gap-3">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="gender"
                    value="male"
                    tabindex="6"
                    class="mr-1 text-blue-600 focus:ring-blue-500"
                    @change="handleInputChange"
                  />
                  <span class="text-xs text-gray-600">♂</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="gender"
                    value="female"
                    tabindex="7"
                    class="mr-1 text-pink-600 focus:ring-pink-500"
                    @change="handleInputChange"
                  />
                  <span class="text-xs text-gray-600">♀</span>
                </label>
              </div>
            </div>
            <!-- Month Input -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1 text-center">Month</label>
              <input
                v-model="monthInput"
                type="number"
                min="1"
                max="12"
                placeholder="MM"
                tabindex="4"
                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                @change="handleInputChange"
              />
            </div>
            <!-- Year Input -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1 text-center">Year</label>
              <input
                v-model="yearInput"
                type="number"
                min="1900"
                max="2100"
                placeholder="YYYY"
                tabindex="5"
                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
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
            <!-- View Mode Toggle - Base, Post Interaction -->
            <div class="mb-4 max-w-lg">
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
            
            <!-- Traditional 2x4 Square Grid -->
            <div class="relative max-w-lg">
              <!-- Heavenly Stems Row -->
              <div class="grid grid-cols-4 gap-1">
                <div v-for="(pillar, index) in pillarsOrdered" :key="`stem-${index}`" class="relative">
                  <div 
                    :id="`stem-${index}`"
                    class="aspect-square p-3 rounded transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-center"
                    :class="[
                      hoveredNode === `stem-${index}` ? 'shadow-lg scale-105' : 'border border-gray-300',
                      highlightedNodes.includes(`stem-${index}`) ? 'ring-2 ring-blue-400' : '',
                      index === 1 ? 'border-2 border-blue-500' : '',
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
                    <div v-if="viewMode !== 'base' && !pillar.isUnknown && index < 3 && !pillarsOrdered[index + 1].isUnknown && getWuXingRelation(pillar.stem.element, pillarsOrdered[index + 1].stem.element)"
                         class="absolute -right-3 top-1/2 -translate-y-1/2 text-lg font-bold z-30"
                         :class="getWuXingRelationClass(pillar.stem.element, pillarsOrdered[index + 1].stem.element)"
                         :title="`${pillar.stem.element} to ${pillarsOrdered[index + 1].stem.element}`">
                      {{ getWuXingRelation(pillar.stem.element, pillarsOrdered[index + 1].stem.element) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Vertical WuXing Flow Indicators - Always present to maintain consistent spacing -->
              <div class="grid grid-cols-4 gap-1 -mt-1.5 -mb-1.5 relative z-40">
                <div v-for="(pillar, index) in pillarsOrdered" :key="`flow-${index}`" 
                     class="flex justify-center items-center h-5">
                  <div v-if="viewMode !== 'base' && !pillar.isUnknown && getVerticalWuXingRelation(pillar.stem.element, pillar.branch.element)"
                       class="text-lg font-bold"
                       :class="getVerticalWuXingClass(pillar.stem.element, pillar.branch.element)"
                       :title="`${pillar.stem.element} to ${pillar.branch.element}`">
                    {{ getVerticalWuXingRelation(pillar.stem.element, pillar.branch.element) }}
                  </div>
                </div>
              </div>
              
              <!-- Earthly Branches Row -->
              <div class="grid grid-cols-4 gap-1 overflow-visible">
                <div v-for="(pillar, index) in pillarsOrdered" :key="`branch-${index}`" class="relative">
                  <div 
                    :id="`branch-${index}`"
                    class="pb-0 pt-2 px-3 rounded transition-all duration-300 cursor-pointer relative flex flex-col items-center justify-start"
                    :class="[
                      hoveredNode === `branch-${index}` ? 'shadow-lg scale-105' : 'border border-gray-300',
                      highlightedNodes.includes(`branch-${index}`) ? 'ring-2 ring-blue-400' : '',
                      index === 1 ? 'border-2 border-blue-500' : '',
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
                    <div v-if="viewMode !== 'base' && !pillar.isUnknown && index < 3 && !pillarsOrdered[index + 1].isUnknown && getWuXingRelation(pillar.branch.element, pillarsOrdered[index + 1].branch.element)"
                         class="absolute -right-3 top-1/3 -translate-y-1/2 text-lg font-bold z-50"
                         :class="getWuXingRelationClass(pillar.branch.element, pillarsOrdered[index + 1].branch.element)"
                         :title="`${pillar.branch.element} to ${pillarsOrdered[index + 1].branch.element}`">
                      {{ getWuXingRelation(pillar.branch.element, pillarsOrdered[index + 1].branch.element) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Interactions Toggle Button - Only show in post/transformed view if there are interactions -->
              <div v-if="viewMode !== 'base' && pillarsOrdered && nonNaturalInteractions.length > 0" class="mt-4 max-w-lg">
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
              <div v-if="showInteractions && pillarsOrdered && interactions" class="grid grid-cols-4 gap-1 mt-2">
                <div v-for="(pillar, index) in pillarsOrdered" :key="`interactions-${index}`" class="text-xs">
                  <!-- Pillar Interactions -->
                  <div v-if="getPillarInteractionData(index).length > 0" class="space-y-1">
                    <div 
                      v-for="(interaction, idx) in getPillarInteractionData(index)" 
                      :key="`${index}-${idx}`"
                      @mouseenter="highlightInteraction(interaction)"
                      @mouseleave="clearHighlight()"
                      :class="[
                        'bg-gray-50 border rounded p-2 cursor-pointer transition-all',
                        isInteractionHighlighted(interaction) ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                      ]"
                    >
                      <div class="font-medium text-gray-700 text-[11px] leading-tight">{{ interaction.display }}</div>
                      <div v-if="interaction.subtitle" class="text-[10px] text-gray-500 mt-0.5">{{ interaction.subtitle }}</div>
                    </div>
                  </div>
                  <!-- Empty placeholder if no interactions -->
                  <div v-else class="min-h-[20px]"></div>
                </div>
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
          <div v-if="chartData?.daymaster_analysis" class="mt-4 p-4 bg-blue-50 rounded-lg max-w-lg">
            <div class="text-sm">
              <span class="font-semibold">Day Master:</span> 
              {{ chartData?.daymaster_analysis?.daymaster }} 
              ({{ chartData?.daymaster_analysis?.daymaster_strength }} - {{ Math.round(chartData?.daymaster_analysis?.daymaster_percentage) }}%)
            </div>
            <div class="text-sm mt-2">
              <span class="font-semibold text-green-700">Favorable:</span> 
              {{ chartData?.daymaster_analysis?.favorable_elements?.join(', ') }}
            </div>
            <div class="text-sm">
              <span class="font-semibold text-red-700">Unfavorable:</span> 
              {{ chartData?.daymaster_analysis?.unfavorable_elements?.join(', ') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section - Additional Analysis -->
      <div v-if="chartData" class="space-y-8 mt-8">
        <!-- Element Scores Comparison -->
        <div v-if="chartData?.daymaster_analysis" class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Elemental Energy Transformation</h2>
            <!-- Element View Toggle - Button style -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-600">View:</span>
              <div class="flex bg-gray-100 rounded-md p-0.5">
                <button
                  @click="elementView = 'before'"
                  :class="[
                    'px-3 py-1 text-xs rounded transition-all',
                    elementView === 'before'
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  Before
                </button>
                <button
                  @click="elementView = 'combined'"
                  :class="[
                    'px-3 py-1 text-xs rounded transition-all',
                    elementView === 'combined'
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  Combined
                </button>
                <button
                  @click="elementView = 'after'"
                  :class="[
                    'px-3 py-1 text-xs rounded transition-all',
                    elementView === 'after'
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  After
                </button>
              </div>
            </div>
          </div>
          
          <!-- Five Elements Analysis -->
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Five Elements Analysis with Relationships</h3>
              <div class="text-xs text-gray-500 mb-2">
                Total Points: {{ Math.round(elementView === 'before' ? naiveTotal : elementView === 'after' ? finalTotal : maxElementScore) }}
              </div>
              <div class="space-y-4">
                <div v-for="element in fiveElementsWithRelations" :key="element.name">
                  <div class="flex justify-between items-center text-sm mb-1">
                    <div class="flex items-center gap-2">
                      <span :class="getElementColor(element.name)" class="font-medium">{{ element.name }}</span>
                      <span v-if="element.relationship" class="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                        {{ element.relationship }}
                      </span>
                      <!-- Change indicator with different levels (only show in combined view) -->
                      <template v-if="elementView === 'combined'">
                        <!-- Very Boosted (>50 points) -->
                        <span v-if="element.change > 50" class="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                          Very Boosted ⇈
                        </span>
                        <!-- Boosted (0-50 points) -->
                        <span v-else-if="element.change > 0" class="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full opacity-80">
                          Boosted ↑
                        </span>
                        <!-- Very Reduced (<-50 points) -->
                        <span v-else-if="element.change < -50" class="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                          Very Reduced ⇊
                        </span>
                        <!-- Reduced (0 to -50 points) -->
                        <span v-else-if="element.change < 0" class="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full opacity-80">
                          Reduced ↓
                        </span>
                      </template>
                    </div>
                    <span class="text-gray-600">
                      <!-- Before view: show only naive score -->
                      <template v-if="elementView === 'before'">
                        {{ Math.round(element.naive) }}
                      </template>
                      <!-- Combined view: show transformation -->
                      <template v-else-if="elementView === 'combined'">
                        {{ Math.round(element.naive) }} → {{ Math.round(element.final) }}
                        <span :class="element.change > 0 ? 'text-green-600 font-medium' : element.change < 0 ? 'text-red-600 font-medium' : 'text-gray-400'">
                          ({{ element.change > 0 ? '+' : '' }}{{ Math.round(element.change) }})
                        </span>
                      </template>
                      <!-- After view: show only final score -->
                      <template v-else>
                        {{ Math.round(element.final) }}
                      </template>
                    </span>
                  </div>
                  <div class="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <!-- Background scale markers -->
                    <div class="absolute inset-0 flex">
                      <div class="w-1/4 border-r border-gray-200"></div>
                      <div class="w-1/4 border-r border-gray-200"></div>
                      <div class="w-1/4 border-r border-gray-200"></div>
                      <div class="w-1/4"></div>
                    </div>
                    
                    <!-- Before View: Show only naive scores -->
                    <template v-if="elementView === 'before'">
                      <div
                        class="absolute top-0 left-0 h-full rounded-lg transition-all duration-500"
                        :class="getElementBgColor(element.name)"
                        :style="`width: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"
                      ></div>
                      <!-- Value label -->
                      <div
                        class="absolute top-0 h-full flex items-center transition-all duration-500"
                        :style="`left: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"
                      >
                        <span class="ml-2 text-xs font-medium text-gray-700">
                          {{ Math.round((element.naive / maxElementScore) * 100) }}%
                        </span>
                      </div>
                    </template>
                    
                    <!-- After View: Show only final scores -->
                    <template v-else-if="elementView === 'after'">
                      <div
                        class="absolute top-0 left-0 h-full rounded-lg transition-all duration-500"
                        :class="getElementBgColor(element.name)"
                        :style="`width: ${Math.min((element.final / maxElementScore) * 100, 100)}%`"
                      ></div>
                      <!-- Value label -->
                      <div
                        class="absolute top-0 h-full flex items-center transition-all duration-500"
                        :style="`left: ${Math.min((element.final / maxElementScore) * 100, 100)}%`"
                      >
                        <span class="ml-2 text-xs font-medium text-gray-700">
                          {{ Math.round((element.final / maxElementScore) * 100) }}%
                        </span>
                      </div>
                    </template>
                    
                    <!-- Combined View: Show both naive and final with transformation -->
                    <template v-else>
                      <!-- For very boosted elements (show checkered pattern) -->
                      <template v-if="element.change > 50">
                        <!-- Base bar (up to naive value) -->
                        <div
                          class="absolute top-0 left-0 h-full rounded-l-lg transition-all duration-500"
                          :class="getElementBgColor(element.name)"
                          :style="`width: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"
                        ></div>
                        
                        <!-- Boosted portion with checkered pattern -->
                        <div
                          class="absolute top-0 h-full rounded-r-lg animate-subtle-pulse transition-all duration-500"
                          :class="getElementBgColor(element.name)"
                          :style="`
                            left: ${Math.min((element.naive / maxElementScore) * 100, 100)}%;
                            width: ${Math.min(((element.final - element.naive) / maxElementScore) * 100, 100 - (element.naive / maxElementScore) * 100)}%;
                            background-image: repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 3px,
                              rgba(255,255,255,0.3) 3px,
                              rgba(255,255,255,0.3) 6px
                            );
                          `"
                        ></div>
                        
                        <!-- Vertical line showing "before" value -->
                        <div
                          class="absolute top-0 h-full w-px border-l border-dotted border-gray-400"
                          :style="`left: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"
                        >
                          <!-- Small label above the line -->
                          <div class="absolute -top-3 left-0 transform -translate-x-1/2 text-xs text-gray-500 font-medium whitespace-nowrap">
                            {{ Math.round((element.naive / maxElementScore) * 100) }}%
                          </div>
                        </div>
                      </template>
                      
                      <!-- For boosted elements (0-50 change) -->
                      <template v-else-if="element.change > 0">
                        <!-- Base bar (up to naive value) -->
                        <div
                          class="absolute top-0 left-0 h-full rounded-l-lg transition-all duration-500"
                          :class="getElementBgColor(element.name)"
                          :style="`width: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"
                        ></div>
                        
                        <!-- Boosted portion with checkered pattern (lighter for regular boost) -->
                        <div
                          class="absolute top-0 h-full rounded-r-lg transition-all duration-500"
                          :class="getElementBgColor(element.name)"
                          :style="`
                            left: ${Math.min((element.naive / maxElementScore) * 100, 100)}%;
                            width: ${Math.min(((element.final - element.naive) / maxElementScore) * 100, 100 - (element.naive / maxElementScore) * 100)}%;
                            background-image: repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 3px,
                              rgba(255,255,255,0.2) 3px,
                              rgba(255,255,255,0.2) 6px
                            );
                          `"
                        ></div>
                        
                        <!-- Vertical line showing "before" value -->
                        <div
                          class="absolute top-0 h-full w-px border-l border-dotted border-gray-300"
                          :style="`left: ${Math.min((element.naive / maxElementScore) * 100, 100)}%`"
                        >
                          <!-- Small label above the line -->
                          <div class="absolute -top-3 left-0 transform -translate-x-1/2 text-xs text-gray-400 font-medium whitespace-nowrap">
                            {{ Math.round((element.naive / maxElementScore) * 100) }}%
                          </div>
                        </div>
                      </template>
                      
                      <!-- For reduced or normal elements (previous style) -->
                      <template v-else>
                        <!-- Naive Score (outlined) -->
                        <div
                          class="absolute top-0 left-0 h-full rounded-lg transition-all duration-500"
                          :class="[
                            element.change < 0 ? 'border border-dotted' : 'border-2',
                            getElementBorderColor(element.name)
                          ]"
                          :style="`width: ${Math.min((element.naive / maxElementScore) * 100, 100)}%; background-color: transparent;`"
                        ></div>
                        
                        <!-- Final Score (filled) -->
                        <div
                          class="absolute top-0 left-0 h-full rounded-lg transition-all duration-700"
                          :class="[
                            getElementBgColor(element.name),
                            element.change < -50 ? 'opacity-60' : element.change < 0 ? 'opacity-80' : ''
                          ]"
                          :style="`width: ${Math.min((element.final / maxElementScore) * 100, 100)}%`"
                        ></div>
                      </template>
                      
                      <!-- Final value label (percentage) - outside the bar -->
                      <div
                        class="absolute top-0 h-full flex items-center transition-all duration-500"
                        :style="`left: ${Math.min((element.final / maxElementScore) * 100, 100)}%`"
                      >
                        <span class="ml-2 text-xs font-medium text-gray-700">
                          {{ Math.round((element.final / maxElementScore) * 100) }}%
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interaction Log - Only show if there are interactions -->
        <div v-if="interactions.length > 0" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold mb-4">
            Interaction Analysis Log
            <span class="text-sm font-normal text-gray-500 ml-2">({{ interactions.length }} interactions)</span>
          </h2>
          <div class="space-y-3 max-h-[500px] overflow-y-auto">
            <div
              v-for="(interaction, index) in interactions"
              :key="index"
              class="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow"
              :class="getInteractionBorderColor(interaction.type)"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <!-- Header with type and pattern -->
                  <div class="flex items-center gap-2 mb-2">
                    <div class="font-semibold text-sm" :class="getInteractionTextColor(interaction.type)">
                      {{ formatInteractionType(interaction.type) }}
                    </div>
                    <span v-if="interaction.pattern" class="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">
                      {{ interaction.pattern }}
                    </span>
                    <span v-if="interaction.adjacent" class="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                      Adjacent
                    </span>
                  </div>
                  
                  <!-- Description -->
                  <div class="text-sm text-gray-700">
                    {{ formatInteractionDescription(interaction) }}
                  </div>
                  
                  <!-- Additional details grid -->
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    <!-- Effect Level -->
                    <div v-if="interaction.effect" class="flex items-center gap-1">
                      <span class="text-xs text-gray-500">Effect:</span>
                      <span 
                        class="text-xs font-medium px-1.5 py-0.5 rounded"
                        :class="{
                          'bg-red-100 text-red-700': interaction.effect === 'High',
                          'bg-orange-100 text-orange-700': interaction.effect === 'Medium',
                          'bg-yellow-100 text-yellow-700': interaction.effect === 'Low',
                          'bg-gray-100 text-gray-700': interaction.effect === 'None'
                        }"
                      >
                        {{ interaction.effect }}
                      </span>
                    </div>
                    
                    <!-- Reduction/Change -->
                    <div v-if="interaction.reduction" class="flex items-center gap-1">
                      <span class="text-xs text-gray-500">Change:</span>
                      <span class="text-xs font-mono font-medium text-red-600">
                        {{ interaction.reduction }}
                      </span>
                    </div>
                    
                    <!-- Positions -->
                    <div v-if="interaction.positions && interaction.positions.length" class="flex items-center gap-1">
                      <span class="text-xs text-gray-500">Positions:</span>
                      <span class="text-xs font-mono">
                        {{ interaction.positions.map(p => getPillarPosition(p)).join(' → ') }}
                      </span>
                    </div>
                    
                    <!-- Branches/Stems involved -->
                    <div v-if="interaction.branches && interaction.branches.length" class="flex items-center gap-1">
                      <span class="text-xs text-gray-500">Branches:</span>
                      <span class="text-xs font-medium">
                        {{ interaction.branches.join(', ') }}
                      </span>
                    </div>
                    
                    <div v-if="interaction.stems && interaction.stems.length" class="flex items-center gap-1">
                      <span class="text-xs text-gray-500">Stems:</span>
                      <span class="text-xs font-medium">
                        {{ interaction.stems.join(', ') }}
                      </span>
                    </div>
                    
                    <!-- Relationship -->
                    <div v-if="interaction.relationship" class="col-span-2">
                      <span class="text-xs text-gray-500">Relationship:</span>
                      <span class="text-xs ml-1">{{ interaction.relationship }}</span>
                    </div>
                  </div>
                  
                  <!-- Element changes if available -->
                  <div v-if="interaction.element_changes" class="mt-2 pt-2 border-t border-gray-200">
                    <div class="text-xs text-gray-500 mb-1">Element Changes:</div>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="(change, element) in interaction.element_changes" 
                        :key="element"
                        class="text-xs px-1.5 py-0.5 rounded"
                        :class="change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                      >
                        {{ element }}: {{ change > 0 ? '+' : '' }}{{ change }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Node indicators -->
                <div class="ml-4 flex flex-col gap-1">
                  <div v-for="node in (interaction.nodes || [])" :key="node" 
                       class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono">
                    {{ formatNodeName(node) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Form data
const birthDate = ref('1992-07-06')
const birthTime = ref('09:30')
const gender = ref('female')
const isLoading = ref(false)
const chartData = ref(null)
const unknownHour = ref(false)

// Individual pillar inputs
const yearInput = ref(1992)
const monthInput = ref(7)
const dayInput = ref(6)

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

// Element view state for transformation animation
const elementView = ref('combined') // 'before', 'combined', or 'after'

// View mode state: 'base' or 'post' - default to 'post' to show energy flow
const viewMode = ref('post')
const showTransformed = computed(() => viewMode.value === 'post')

// Interactions display state
const showInteractions = ref(false)
const highlightedInteraction = ref(null)

// Watch for view mode changes to hide interactions in Base view
watch(viewMode, (newMode) => {
  if (newMode === 'base') {
    showInteractions.value = false
  }
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
                    'hs_luck_10_year', 'eb_luck_10_year', 'hs_annual', 'eb_annual',
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
    
    // Ten gods for hidden stems should also be recalculated based on the qi being used
    const hiddenStems = {}
    if (hiddenQi && data.mappings?.ten_gods) {
      const dayMasterStem = data.hs_d?.base?.id || 'Yi'
      for (const stemName of Object.keys(hiddenQi)) {
        const tenGodData = data.mappings?.ten_gods?.[dayMasterStem]?.[stemName]
        if (tenGodData) {
          hiddenStems[stemName] = tenGodData.id || tenGodData.abbreviation || 'Unknown'
        }
      }
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
      tenGod: isDayMaster ? 'DM' : null,
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

// Ordered pillars for mainstream display (left to right: Hour, Day, Month, Year)
const pillarsOrdered = computed(() => {
  if (!pillars.value) return null
  return [
    pillars.value.hour,
    pillars.value.day,
    pillars.value.month,
    pillars.value.year
  ]
})

const tenElements = computed(() => {
  if (!chartData.value?.naive_element_scores || !chartData.value?.final_element_scores) return []
  
  const naive = chartData.value.naive_element_scores.ten_elements
  const final = chartData.value.final_element_scores.ten_elements
  const elements = [
    'Yang Wood', 'Yin Wood', 
    'Yang Fire', 'Yin Fire',
    'Yang Earth', 'Yin Earth',
    'Yang Metal', 'Yin Metal',
    'Yang Water', 'Yin Water'
  ]
  
  return elements.map(name => ({
    name,
    naive: naive[name]?.score || 0,
    final: final[name]?.score || 0,
    change: (final[name]?.score || 0) - (naive[name]?.score || 0)
  }))
})

const fiveElements = computed(() => {
  if (!chartData.value?.naive_element_scores || !chartData.value?.final_element_scores) return []
  
  const naive = chartData.value.naive_element_scores.five_elements
  const final = chartData.value.final_element_scores.five_elements
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  
  return elements.map(name => ({
    name,
    naive: naive[name]?.score || 0,
    final: final[name]?.score || 0,
    change: (final[name]?.score || 0) - (naive[name]?.score || 0)
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
    const response = await fetch(`/api/bazi/generate_natal_chart?birth_date=${birthDate.value}&birth_time=${timeParam}&gender=${gender.value}`)
    if (!response.ok) throw new Error('API request failed')
    const data = await response.json()
    console.log('Chart data received:', data)
    chartData.value = data
    console.log('chartData.value set, pillarsOrdered:', pillarsOrdered.value)
  } catch (error) {
    console.error('Error:', error)
    if (typeof window !== 'undefined') {
      alert('Failed to generate chart. Please ensure the backend is running.')
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
  
  // Use base qi in base mode, post_qi in other modes
  let qiData = null
  if (viewMode.value === 'base' && ebNode?.qi) {
    // Use initial qi for base view (already in array format with stem IDs)
    qiData = ebNode.qi
  } else if (ebNode?.post_qi) {
    // Use post_qi for post-interaction and transformed views
    qiData = ebNode.post_qi
  } else if (ebNode?.qi) {
    // Fallback to qi if post_qi not available
    qiData = ebNode.qi
  } else if (pillar.hiddenQi && pillar.hiddenQi.length > 0) {
    // Legacy support
    qiData = pillar.hiddenQi
  }
  
  if (qiData && qiData.length > 0) {
    const result = {}
    const totalScore = qiData.reduce((sum, qi) => sum + qi.score, 0)
    
    for (const qi of qiData) {
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
    'ARCHED_COMBINATIONS': '拱合 Arched Combinations',
    'CLASHES': '沖 Clashes',
    'HARMS': '害 Harms',
    'DESTRUCTIONS': '破 Destructions',
    'HS_CONFLICT': '天干沖 Stem Conflicts',
    'HS_COMBINATION': '天干合 Stem Combinations',
    'NATURAL_GENERATING': '生 Energy Flow (Generation)',
    'NATURAL_CONTROLLING': '剋 Energy Flow (Control)',
    'ENERGY_FLOW_GENERATING': '生 Energy Flow (Generation)',
    'ENERGY_FLOW_CONTROLLING': '剋 Energy Flow (Control)'
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

function formatNodeName(node) {
  const nodeMap = {
    'hs_y': 'Year Stem',
    'hs_m': 'Month Stem',
    'hs_d': 'Day Stem',
    'hs_h': 'Hour Stem',
    'eb_y': 'Year Branch',
    'eb_m': 'Month Branch',
    'eb_d': 'Day Branch',
    'eb_h': 'Hour Branch'
  }
  return nodeMap[node] || node
}

function getPillarPosition(position) {
  const positions = ['Year', 'Month', 'Day', 'Hour']
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
  if (!interactions.value) return []
  const pillarInteractions = getPillarInteractions(pillarIndex)
  if (!pillarInteractions || !pillarInteractions.length) return []
  
  return pillarInteractions.map(interaction => {
    // Build comprehensive display text from API data
    let display = ''
    let subtitle = ''
    
    // Special handling for HS_CONFLICT
    if (interaction.type === 'HS_CONFLICT') {
      if (interaction.pattern) {
        display = `Stem Conflict: ${interaction.pattern}`
      }
      if (interaction.conflictor && interaction.conflicted) {
        subtitle = `${interaction.conflictor.stem} vs ${interaction.conflicted.stem}`
      }
    } else {
      // Main display text for other types
      if (interaction.pattern) {
        display = interaction.pattern
      } else if (interaction.description) {
        display = interaction.description
      } else {
        // Fallback to formatted type name
        display = interaction.type.replace(/_/g, ' ').toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
      
      // Add participants
      if (interaction.branches && interaction.branches.length) {
        const branches = interaction.branches.join('-')
        display = `${display} (${branches})`
      } else if (interaction.stems && interaction.stems.length) {
        const stems = interaction.stems.join('-')
        display = `${display} (${stems})`
      }
    }
    
    // Add effect or transformation info if available
    if (!subtitle) {
      if (interaction.transformation) {
        subtitle = `Transform: ${interaction.element || interaction.transformation}`
      } else if (interaction.effect) {
        subtitle = `Effect: ${interaction.effect}`
      } else if (interaction.points) {
        subtitle = interaction.points
      }
    }
    
    return {
      ...interaction,
      display,
      subtitle
    }
  })
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
  // Map to display order: Hour, Day, Month, Year (left to right)
  const pillarMap = { 'h': 0, 'd': 1, 'm': 2, 'y': 3 }
  const pillarType = nodeKey.split('_')[1]
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

// Cycle through element view modes
function cycleElementView() {
  const views = ['before', 'combined', 'after']
  const currentIndex = views.indexOf(elementView.value)
  const nextIndex = (currentIndex + 1) % views.length
  elementView.value = views[nextIndex]
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