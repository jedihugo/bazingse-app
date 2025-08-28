import type { BaZiData, LuckPillar, AnnualPillar, MonthlyPillar, DailyPillar } from '~/types/bazi'

export const useBaziData = () => {
  // Reactive state
  const baziData = ref<BaZiData | null>(null)
  const selectedLuckPillar = ref<LuckPillar | null>(null)
  const selectedAnnualLuck = ref<AnnualPillar | null>(null)
  const selectedMonthlyLuck = ref<MonthlyPillar | null>(null)
  const selectedDailyLuck = ref<DailyPillar | null>(null)
  const isLoading = ref(false)
  const error = ref<string>('')

  // API base URLs
  const DIRECT_API_URL = 'http://localhost:8008'
  const PROXY_API_URL = '/api/bazi' // Nuxt server proxy route

  // Sample data for initial display (if needed)
  const sampleData: BaZiData = {
    "natal_chart": {
      "year_pillar": {
        "pillar": "Bing Yin",
        "hs_element": "Fire",
        "eb_animal": "Tiger",
        "ten_god_hs": "RW",
        "ten_god_hidden": {
          "Jia": "DR",
          "Wu": "HO", 
          "Bing": "RW"
        }
      },
      "month_pillar": {
        "pillar": "Ji Hai",
        "hs_element": "Earth",
        "eb_animal": "Pig",
        "ten_god_hs": "EG",
        "ten_god_hidden": {
          "Ren": "DO",
          "Jia": "DR"
        }
      },
      "day_pillar": {
        "pillar": "Ding Chou",
        "hs_element": "Fire",
        "eb_animal": "Ox",
        "ten_god_hs": "Day Master",
        "ten_god_hidden": {
          "Ji": "EG",
          "Gui": "7K",
          "Xin": "IW"
        }
      },
      "hour_pillar": {
        "pillar": "Ding Wei",
        "hs_element": "Fire",
        "eb_animal": "Goat",
        "ten_god_hs": "F",
        "ten_god_hidden": {
          "Ji": "EG",
          "Yi": "IR",
          "Ding": "F"
        }
      }
    },
    "luck_pillars": [
      {
        "pillar": "Geng Zi",
        "year": "~1989-1998",
        "age": "~3-12",
        "hs_element": "Metal",
        "eb_animal": "Rat",
        "ten_god_hs": "DW",
        "ten_god_hidden": {
          "Gui": "7K",
          "Ren": "DO"
        }
      },
      {
        "pillar": "Xin Chou",
        "year": "~1999-2008",
        "age": "~13-22",
        "hs_element": "Metal",
        "eb_animal": "Ox",
        "ten_god_hs": "IW",
        "ten_god_hidden": {
          "Ji": "EG",
          "Gui": "7K",
          "Xin": "IW"
        }
      },
      {
        "pillar": "Ren Yin",
        "year": "~2009-2018",
        "age": "~23-32",
        "hs_element": "Water",
        "eb_animal": "Tiger",
        "ten_god_hs": "DO",
        "ten_god_hidden": {
          "Jia": "DR",
          "Wu": "HO",
          "Bing": "RW"
        }
      },
      {
        "pillar": "Gui Mao",
        "year": "~2019-2028",
        "age": "~33-42",
        "hs_element": "Water",
        "eb_animal": "Rabbit",
        "ten_god_hs": "7K",
        "ten_god_hidden": {
          "Yi": "IR"
        }
      },
      {
        "pillar": "Jia Chen",
        "year": "~2029-2038",
        "age": "~43-52",
        "hs_element": "Wood",
        "eb_animal": "Dragon",
        "ten_god_hs": "DR",
        "ten_god_hidden": {
          "Wu": "HO",
          "Yi": "IR",
          "Gui": "7K"
        }
      },
      {
        "pillar": "Yi Si",
        "year": "~2039-2048",
        "age": "~53-62",
        "hs_element": "Wood",
        "eb_animal": "Snake",
        "ten_god_hs": "IR",
        "ten_god_hidden": {
          "Bing": "RW",
          "Wu": "HO",
          "Geng": "DW"
        }
      },
      {
        "pillar": "Bing Wu",
        "year": "~2049-2058",
        "age": "~63-72",
        "hs_element": "Fire",
        "eb_animal": "Horse",
        "ten_god_hs": "RW",
        "ten_god_hidden": {
          "Ding": "F",
          "Ji": "EG"
        }
      },
      {
        "pillar": "Ding Wei",
        "year": "~2059-2068",
        "age": "~73-82",
        "hs_element": "Fire",
        "eb_animal": "Goat",
        "ten_god_hs": "F",
        "ten_god_hidden": {
          "Ji": "EG",
          "Yi": "IR",
          "Ding": "F"
        }
      }
    ],
    "selected_luck_pillar": {
      "pillar": "Gui Mao",
      "year": "~2019-2028",
      "age": "~33-42",
      "hs_element": "Water",
      "eb_animal": "Rabbit",
      "ten_god_hs": "7K",
      "ten_god_hidden": {
        "Yi": "IR"
      }
    }
  }

  // Function to generate chart from API (with fallback to proxy)
  const generateChart = async (birthDate: string, birthTime: string, gender: string, luckPillarIndex: number = 0) => {
    isLoading.value = true
    error.value = ''
    
    // Try direct API first, then fallback to proxy
    const tryDirectAPI = async () => {
      // Align with backend's expected request format
      const requestBody = {
        birth_date: birthDate,
        birth_time: birthTime,
        gender: gender,
        include_10_year_luck: true,
        luck_pillar_10_year_index: luckPillarIndex,
        include_annual_luck: true,
        annual_year: new Date().getFullYear()
      }
      
      console.log('Trying direct API call with body:', requestBody)
      
      // Try POST method first (backend may prefer this)
      try {
        const response = await fetch(`${DIRECT_API_URL}/generate_chart`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify(requestBody)
        })
        
        if (response.ok) {
          return await response.json()
        }
      } catch (postError) {
        console.log('POST method failed, trying GET method')
      }
      
      // Fallback to original GET method
      const encodedTime = encodeURIComponent(birthTime)
      const url = `${DIRECT_API_URL}/generate_chart?luck_pillar_index=${luckPillarIndex}&birth_date=${birthDate}&birth_time=${encodedTime}&gender=${gender}`
      
      console.log('Trying direct API GET call to:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      })
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    }
    
    const tryProxyAPI = async () => {
      const url = `${PROXY_API_URL}?luck_pillar_index=${luckPillarIndex}&birth_date=${birthDate}&birth_time=${encodeURIComponent(birthTime)}&gender=${gender}`
      
      console.log('Trying proxy API call to:', url)
      
      return await $fetch(url, {
        method: 'GET'
      })
    }
    
    try {
      // Try direct API first
      let data
      try {
        data = await tryDirectAPI()
        console.log('Direct API call successful')
      } catch (directError) {
        console.log('Direct API failed, trying proxy:', directError.message)
        data = await tryProxyAPI()
        console.log('Proxy API call successful')
      }
      
      baziData.value = data
      selectedLuckPillar.value = data.selected_luck_pillar
      
      console.log('API response received:', data)
    } catch (err: any) {
      console.error('Both API calls failed:', err)
      
      // More specific error messages for backend integration
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        error.value = 'Cannot connect to BaZingSe API server. Please ensure:\n1. Python FastAPI server is running: python run_bazingse.py\n2. Server is accessible on http://localhost:8008\n3. No firewall is blocking the connection'
      } else if (err.message.includes('CORS')) {
        error.value = 'CORS error: The BaZingSe API server needs CORS configuration. The request is using the Nuxt proxy as fallback.'
      } else if (err.message.includes('422')) {
        error.value = 'Invalid input format. Please check the birth date, time format, and gender values match the expected API format.'
      } else if (err.message.includes('500')) {
        error.value = 'BaZi calculation error on server. This may be due to invalid Chinese calendar conversion or missing sxtwl library.'
      } else {
        error.value = err?.data?.statusMessage || err?.message || 'Failed to generate BaZi chart. Please check the console for details.'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Function to update data from API
  const updateBaziData = (newData: BaZiData) => {
    baziData.value = newData
    selectedLuckPillar.value = newData.selected_luck_pillar
  }

  // Function to select a different luck pillar and fetch its annual pillars from API
  const selectLuckPillar = async (pillar: LuckPillar, birthDate?: string, birthTime?: string, gender?: string) => {
    console.log('selectLuckPillar called with:', pillar)
    
    // Check if clicking the same pillar - if so, deselect it
    if (selectedLuckPillar.value && selectedLuckPillar.value.pillar === pillar.pillar) {
      selectedLuckPillar.value = null
      if (baziData.value) {
        baziData.value.selected_luck_pillar = null as any
      }
      selectedAnnualLuck.value = null
      console.log('selectedLuckPillar deselected')
      return
    }
    
    // Find the index of this pillar in the luck_pillars array
    const pillarIndex = baziData.value?.luck_pillars.findIndex(p => p.pillar === pillar.pillar) ?? -1
    
    if (pillarIndex !== -1 && birthDate && birthTime && gender) {
      // Fetch updated data from API with the selected luck pillar index
      await generateChart(birthDate, birthTime, gender, pillarIndex)
    } else {
      // Fallback to client-side selection if no birth data available
      selectedLuckPillar.value = pillar
      if (baziData.value) {
        baziData.value.selected_luck_pillar = pillar
      }
    }
    
    // Reset annual luck selection when changing luck pillar
    selectedAnnualLuck.value = null
    
    console.log('selectedLuckPillar updated to:', selectedLuckPillar.value)
  }

  // Function to select annual luck
  const selectAnnualLuck = (annualPillar: AnnualPillar) => {
    // Check if clicking the same annual pillar - if so, deselect it
    if (selectedAnnualLuck.value && selectedAnnualLuck.value.year === annualPillar.year) {
      selectedAnnualLuck.value = null
      selectedMonthlyLuck.value = null
      console.log('selectedAnnualLuck deselected')
      return
    }
    
    selectedAnnualLuck.value = annualPillar
    selectedMonthlyLuck.value = null // Reset monthly selection when annual changes
    console.log('selectedAnnualLuck updated to:', selectedAnnualLuck.value)
  }

  // Function to select monthly luck
  const selectMonthlyLuck = (monthlyPillar: MonthlyPillar) => {
    // Check if clicking the same monthly pillar - if so, deselect it
    if (selectedMonthlyLuck.value && selectedMonthlyLuck.value.month === monthlyPillar.month) {
      selectedMonthlyLuck.value = null
      selectedDailyLuck.value = null
      console.log('selectedMonthlyLuck deselected')
      return
    }
    
    selectedMonthlyLuck.value = monthlyPillar
    selectedDailyLuck.value = null // Reset daily selection when monthly changes
    console.log('selectedMonthlyLuck updated to:', selectedMonthlyLuck.value)
  }

  // Function to select daily luck
  const selectDailyLuck = (dailyPillar: DailyPillar) => {
    // Check if clicking the same daily pillar - if so, deselect it
    if (selectedDailyLuck.value && selectedDailyLuck.value.day === dailyPillar.day) {
      selectedDailyLuck.value = null
      console.log('selectedDailyLuck deselected')
      return
    }
    
    selectedDailyLuck.value = dailyPillar
    console.log('selectedDailyLuck updated to:', selectedDailyLuck.value)
  }

  // Get annual luck pillars from API response
  const getAnnualLuckPillars = computed(() => {
    if (!selectedLuckPillar.value?.annual_pillars) return []
    
    // Return the annual pillars from the API response
    // The API returns full pillar data with ten gods, so we just pass it through
    return selectedLuckPillar.value.annual_pillars
  })

  // Get monthly luck pillars from selected annual pillar
  const getMonthlyLuckPillars = computed(() => {
    if (!selectedAnnualLuck.value?.monthly_pillars) return []
    return selectedAnnualLuck.value.monthly_pillars
  })

  // Get daily luck pillars from selected monthly pillar
  const getDailyLuckPillars = computed(() => {
    if (!selectedMonthlyLuck.value?.daily_pillars) return []
    return selectedMonthlyLuck.value.daily_pillars
  })

  return {
    baziData: readonly(baziData),
    selectedLuckPillar: readonly(selectedLuckPillar),
    selectedAnnualLuck: readonly(selectedAnnualLuck),
    selectedMonthlyLuck: readonly(selectedMonthlyLuck),
    selectedDailyLuck: readonly(selectedDailyLuck),
    isLoading: readonly(isLoading),
    error: readonly(error),
    getAnnualLuckPillars,
    getMonthlyLuckPillars,
    getDailyLuckPillars,
    generateChart,
    updateBaziData,
    selectLuckPillar,
    selectAnnualLuck,
    selectMonthlyLuck,
    selectDailyLuck
  }
}