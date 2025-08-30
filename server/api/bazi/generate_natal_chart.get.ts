export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Extract parameters from the request
  const { birth_date, birth_time, gender } = query
  
  if (!birth_date || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters: birth_date, gender'
    })
  }
  
  try {
    // Call the Python backend - now expecting HH:MM format for time
    const timeParam = birth_time === 'unknown' ? 'unknown' : (birth_time as string || 'unknown')
    const apiUrl = `http://localhost:8008/generate_natal_chart?birth_date=${birth_date}&birth_time=${encodeURIComponent(timeParam)}&gender=${gender}`
    
    console.log('Proxying request to:', apiUrl)
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // The new API already provides the structure we need
    // Just add the converted element scores for backward compatibility
    const transformedData = { ...data }
    
    // Map base_element_score to naive_element_scores and post_element_score to final_element_scores
    transformedData.naive_element_scores = data.base_element_score ? {
      ten_elements: convertToElementScores(data.base_element_score),
      five_elements: convertToFiveElements(data.base_element_score)
    } : null
    
    transformedData.final_element_scores = data.post_element_score ? {
      ten_elements: convertToElementScores(data.post_element_score),
      five_elements: convertToFiveElements(data.post_element_score)
    } : null
    
    return transformedData
  } catch (error: any) {
    console.error('Proxy API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch from API: ${error.message}`
    })
  }
})

// Helper function to convert ten god names to abbreviations
function getTenGodAbbreviation(tenGod: any): string {
  // If it's an object with an id, return the id
  if (typeof tenGod === 'object' && tenGod?.id) {
    return tenGod.id
  }
  
  // If it's a string, try to map it
  if (typeof tenGod === 'string') {
    const abbreviations: { [key: string]: string } = {
      'Friend': 'F',
      'Rob Wealth': 'RW',
      'Eating God': 'EG',
      'Hurting Officer': 'HO',
      'Direct Wealth': 'DW',
      'Indirect Wealth': 'IW',
      'Direct Officer': 'DO',
      '7 Killings': '7K',
      'Direct Resource': 'DR',
      'Indirect Resource': 'IR',
      'Day Master': 'Day Master'
    }
    return abbreviations[tenGod] || tenGod
  }
  
  return 'Unknown'
}

// Convert flat element scores to the expected format
function convertToElementScores(scores: any): any {
  const result: any = {}
  
  // Map stem names to element names
  const stemToElement: { [key: string]: string } = {
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
  
  for (const [stem, score] of Object.entries(scores)) {
    const element = stemToElement[stem]
    if (element && typeof score === 'number') {
      result[element] = { score: score, count: score > 0 ? 1 : 0 }
    }
  }
  
  return result
}

// Convert to five elements
function convertToFiveElements(scores: any): any {
  const fiveElements: any = {
    'Wood': { score: 0, count: 0 },
    'Fire': { score: 0, count: 0 },
    'Earth': { score: 0, count: 0 },
    'Metal': { score: 0, count: 0 },
    'Water': { score: 0, count: 0 }
  }
  
  const stemToElement: { [key: string]: string } = {
    'Jia': 'Wood', 'Yi': 'Wood',
    'Bing': 'Fire', 'Ding': 'Fire',
    'Wu': 'Earth', 'Ji': 'Earth',
    'Geng': 'Metal', 'Xin': 'Metal',
    'Ren': 'Water', 'Gui': 'Water'
  }
  
  for (const [stem, score] of Object.entries(scores)) {
    const element = stemToElement[stem]
    if (element && typeof score === 'number') {
      fiveElements[element].score += score
      fiveElements[element].count += 1
    }
  }
  
  return fiveElements
}