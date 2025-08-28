export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)
  
  // Build query string
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const url = `http://localhost:8008/${path}${queryString ? '?' + queryString : ''}`
  
  try {
    const response = await $fetch.raw(url, {
      method: event.method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    return response._data
  } catch (error) {
    console.error('Proxy error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to proxy request to backend'
    })
  }
})