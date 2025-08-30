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
    // Use the new /generate_natal_chart endpoint
    const apiUrl = `http://localhost:8008/generate_natal_chart?birth_date=${birth_date}&birth_time=${encodeURIComponent(birth_time as string || 'unknown')}&gender=${gender}`
    
    console.log('Proxying request to:', apiUrl)
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return data
  } catch (error: any) {
    console.error('Proxy API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch from API: ${error.message}`
    })
  }
})