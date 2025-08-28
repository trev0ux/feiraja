export default defineNuxtPlugin(() => {
  const { $router } = useNuxtApp()
  const { isFirstTimeVisit, markUserVisited, incrementVisitCount, triggerAccessWebhook } = useUserTracking()
  
  // Only run on client-side to access localStorage
  if (process.client) {
    $router.afterEach(async (to) => {
      // Only track access to the home page
      if (to.path === '/') {
        const isFirstTime = isFirstTimeVisit()
        
        console.log('🏠 Home page accessed:', { isFirstTime })
        
        // Trigger webhook for analytics
        await triggerAccessWebhook(isFirstTime)
        
        if (isFirstTime) {
          console.log('🎉 First-time user detected! Redirecting to custom-box...')
          
          // Mark user as visited before redirect
          markUserVisited()
          
          // Redirect to custom-box page
          await navigateTo('/custom-box')
        } else {
          // Increment visit count for returning users
          const visitCount = incrementVisitCount()
          console.log('👋 Returning user! Visit count:', visitCount)
        }
      }
    })
  }
})