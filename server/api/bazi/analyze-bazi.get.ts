export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Build API URL with all parameters
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, String(value))
    }
  }
  
  const apiUrl = `http://localhost:8008/analyze-bazi?${params.toString()}`
  
  console.log('Proxying request to:', apiUrl)
  
  try {
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
