export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const response = await $fetch('http://localhost:8008/parse_input', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    })
    
    return response
  } catch (error: any) {
    console.error('Parse input proxy error:', error)
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.detail || error.message || 'Failed to parse input'
    })
  }
})