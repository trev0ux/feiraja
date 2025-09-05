/**
 * Authentication composable for managing user sessions
 */
export const useAuthUser = () => {
  const userSession = useCookie('user-session', {
    default: () => null,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return userSession
}

export const useAuth = () => {
  const userSession = useAuthUser()
  
  const login = (userData) => {
    userSession.value = userData
  }
  
  const logout = () => {
    userSession.value = null
  }
  
  const isAuthenticated = computed(() => {
    return !!userSession.value
  })
  
  return {
    user: userSession,
    login,
    logout,
    isAuthenticated
  }
}