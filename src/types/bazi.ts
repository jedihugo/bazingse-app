// Qi score structure for each stem
export interface QiValue {
  [stemName: string]: number
}

// Base and post-interaction state for nodes
export interface NodeState {
  id: string
  qi: QiValue
}

// Node structure for heavenly stems and earthly branches
export interface BaziNode {
  base: NodeState
  interaction_ids: string[]
  post: NodeState
  transformed: boolean
  alive: boolean
  interacted: boolean
}

// Birth information
export interface BirthInfo {
  date: string
  time: string
  gender: string
}

// Element score structure
export interface ElementScores {
  [element: string]: number
}

// Daymaster analysis
export interface DaymasterAnalysis {
  daymaster: string
  daymaster_strength: number
  daymaster_percentage: number
  support_percentage: number
  drain_percentage: number
  chart_type: string
  element_relationships: {
    support: string[]
    drain: string[]
    neutral: string[]
  }
  favorable_elements: string[]
  unfavorable_elements: string[]
  useful_god: string
  explanation: string
}

// Interaction detail
export interface InteractionDetail {
  type: string
  pattern: string
  nodes: string[]
  effect?: string
  stage?: string
}

// Interactions structure
export interface Interactions {
  [category: string]: InteractionDetail[] | any
}

// Mapping structures
export interface HeavenlyStemMapping {
  id: string
  pinyin: string
  chinese: string
  english: string
  hex_color: string
}

export interface EarthlyBranchMapping {
  id: string
  chinese: string
  animal: string
  hex_color: string
}

export interface Mappings {
  heavenly_stems: { [key: string]: HeavenlyStemMapping }
  earthly_branches: { [key: string]: EarthlyBranchMapping }
  ten_gods: { [key: string]: { [key: string]: string } }
}

// Luck pillar timing information
export interface LuckPillarTiming {
  start_datetime: string
  end_datetime: string
  start_age: number
  end_age: number
  start_year: number
  start_month: number
  start_day: number
  start_hour: number
  end_year: number
  end_month: number
  end_day: number
  end_hour: number
  duration_days: number
  duration_years: number
}

// Luck pillar from API response
export interface LuckPillarData {
  index: number
  pillar: string
  hs_element: string
  eb_animal: string
  ten_god_hs: string
  ten_god_hidden: { [key: string]: string }
  timing: LuckPillarTiming
  is_current: boolean
}

// Luck pillar response from /generate_10lp_chart
export interface LuckPillarResponse {
  luck_pillars: LuckPillarData[]
  current_luck_pillar: LuckPillarData | null
  luck_calculation_details: any
}

// Main natal chart response structure
export interface NatalChartResponse {
  birth_info: BirthInfo
  hs_y: BaziNode  // Year heavenly stem
  eb_y: BaziNode  // Year earthly branch
  hs_m: BaziNode  // Month heavenly stem
  eb_m: BaziNode  // Month earthly branch
  hs_d: BaziNode  // Day heavenly stem
  eb_d: BaziNode  // Day earthly branch
  hs_h?: BaziNode  // Hour heavenly stem (optional if hour unknown)
  eb_h?: BaziNode  // Hour earthly branch (optional if hour unknown)
  base_element_score: ElementScores
  post_element_score: ElementScores
  interactions: Interactions
  daymaster_analysis: DaymasterAnalysis
  mappings: Mappings
  // Optional luck pillar data (for integrated display)
  current_luck_pillar?: LuckPillarData
}

// Legacy structures for backward compatibility
export interface TenGodHidden {
  [key: string]: string
}

export interface Pillar {
  pillar: string
  hs_element: string
  eb_animal: string
  ten_god_hs: string
  ten_god_hidden: TenGodHidden
}

export interface DailyPillar extends Pillar {
  day: number
}

export interface MonthlyPillar extends Pillar {
  month: number
  chinese_year?: string
  note?: string
  daily_pillars?: DailyPillar[]
}

export interface AnnualPillar extends Pillar {
  year: number
  monthly_pillars?: MonthlyPillar[]
}

export interface LuckPillar extends Pillar {
  year: string
  age: string
  index?: number
  annual_pillars?: AnnualPillar[]
}

export interface NatalChart {
  year_pillar: Pillar
  month_pillar: Pillar
  day_pillar: Pillar
  hour_pillar: Pillar
}

export interface BaZiData {
  natal_chart: NatalChart
  luck_pillars: LuckPillar[]
  selected_luck_pillar: LuckPillar
}

export type ElementType = 'Fire' | 'Earth' | 'Metal' | 'Water' | 'Wood'