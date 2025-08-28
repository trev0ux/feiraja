export const useUserTracking = () => {
  const USER_TRACKING_KEY = 'feiraja_user_visits'
  
  // Check if user is visiting for the first time
  const isFirstTimeVisit = () => {
    if (process.client) {
      const visits = localStorage.getItem(USER_TRACKING_KEY)
      return !visits
    }
    return true // Default to true on server-side
  }
  
  // Mark user as visited
  const markUserVisited = () => {
    if (process.client) {
      const visitData = {
        firstVisit: new Date().toISOString(),
        visitCount: 1,
        lastVisit: new Date().toISOString()
      }
      localStorage.setItem(USER_TRACKING_KEY, JSON.stringify(visitData))
    }
  }
  
  // Increment visit count for returning users
  const incrementVisitCount = () => {
    if (process.client) {
      const existingData = localStorage.getItem(USER_TRACKING_KEY)
      if (existingData) {
        const visitData = JSON.parse(existingData)
        visitData.visitCount = (visitData.visitCount || 1) + 1
        visitData.lastVisit = new Date().toISOString()
        localStorage.setItem(USER_TRACKING_KEY, JSON.stringify(visitData))
        return visitData.visitCount
      }
    }
    return 1
  }
  
  // Get user visit information
  const getUserVisitData = () => {
    if (process.client) {
      const visits = localStorage.getItem(USER_TRACKING_KEY)
      if (visits) {
        return JSON.parse(visits)
      }
    }
    return null
  }
  
  // Webhook to track user access
  const triggerAccessWebhook = async (isFirstTime: boolean) => {
    try {
      const { apiCall } = useApi()
      
      const webhookData = {
        isFirstTime,
        timestamp: new Date().toISOString(),
        userAgent: process.client ? navigator.userAgent : 'server',
        visitData: getUserVisitData()
      }
      
      // Call the webhook endpoint
      await apiCall('/api/webhook/user-access', {
        method: 'POST',
        body: JSON.stringify(webhookData)
      })
      
      console.log('User access webhook triggered:', webhookData)
    } catch (error) {
      console.error('Failed to trigger user access webhook:', error)
    }
  }
  
  return {
    isFirstTimeVisit,
    markUserVisited,
    incrementVisitCount,
    getUserVisitData,
    triggerAccessWebhook
  }
}