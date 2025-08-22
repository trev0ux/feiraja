export const useApi = () => {
  const config = useRuntimeConfig()
  
  const apiBaseUrl = config.public.apiBaseUrl

  const apiCall = async (endpoint: string, options: any = {}) => {
    try {
      const url = `${apiBaseUrl}${endpoint}`
      
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      }

      return await $fetch(url, defaultOptions)
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  return {
    apiCall,
    apiBaseUrl
  }
}