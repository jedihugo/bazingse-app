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