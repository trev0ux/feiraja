export const useApi = () => {
  const config = useRuntimeConfig()
  
  const apiBaseUrl = config.public.apiBaseUrl

  const apiCall = async (endpoint: string, options: any = {}) => {
    try {
      const url = `${apiBaseUrl}${endpoint}`
      
      const defaultOptions = {
        mode: 'cors',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      }

      return await $fetch(url, defaultOptions)
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  const apiCallWithAuth = async (endpoint: string, token: string, options: any = {}) => {
    return apiCall(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    })
  }

  return {
    apiCall,
    apiCallWithAuth,
    apiBaseUrl
  }
}