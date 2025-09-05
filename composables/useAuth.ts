import { ref, computed } from 'vue'

interface User {
  id: number
  phoneNumber: string
  name?: string
  isFirstTime: boolean
  selectedBoxSize?: number
  deliveryDay?: string
  householdSize?: number
  preferences?: any
  hasAddresses: boolean
  boxPrice?: any
  addresses?: any[]
}

interface UserStatus {
  exists: boolean
  userId?: number
  isFirstTime: boolean
  hasBasketConfiguration: boolean
  hasAddress: boolean
  selectedBoxSize?: number
  deliveryDay?: string
  householdSize?: number
}

const user = ref<User | null>(null)
const isAuthenticated = ref(false)
const isLoading = ref(false)

export const useAuth = () => {
  const { $api } = useNuxtApp()

  const authenticateUser = async (phoneNumber: string): Promise<User | null> => {
    try {
      isLoading.value = true
      
      const response = await $api('/users/authenticate', {
        method: 'POST',
        body: { phoneNumber }
      })
      
      if (response.user) {
        user.value = response.user
        isAuthenticated.value = true
        
        // Store phone number in localStorage for persistence
        if (process.client) {
          localStorage.setItem('userPhone', phoneNumber)
        }
        
        return response.user
      }
      
      return null
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const checkUserStatus = async (phoneNumber: string): Promise<UserStatus | null> => {
    try {
      const cleanPhoneNumber = phoneNumber.replace('whatsapp:', '')
      
      const response = await $api(`/users/${encodeURIComponent(cleanPhoneNumber)}/status`)
      return response
    } catch (error) {
      console.error('Check user status error:', error)
      return null
    }
  }

  const getUserProfile = async (phoneNumber: string): Promise<User | null> => {
    try {
      const cleanPhoneNumber = phoneNumber.replace('whatsapp:', '')
      
      const response = await $api(`/users/${encodeURIComponent(cleanPhoneNumber)}/profile`)
      
      if (response.user) {
        user.value = response.user
        isAuthenticated.value = true
        return response.user
      }
      
      return null
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  }

  const updateBasketConfiguration = async (
    phoneNumber: string, 
    configuration: {
      selectedBoxSize: number
      deliveryDay: string
      householdSize: number
      preferences?: any
      isFirstTime?: boolean
    }
  ): Promise<User | null> => {
    try {
      isLoading.value = true
      const cleanPhoneNumber = phoneNumber.replace('whatsapp:', '')
      
      const response = await $api(`/users/${encodeURIComponent(cleanPhoneNumber)}/basket`, {
        method: 'PUT',
        body: configuration
      })
      
      if (response.user) {
        user.value = response.user
        return response.user
      }
      
      return null
    } catch (error) {
      console.error('Update basket configuration error:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const initializeFromURL = async (): Promise<User | null> => {
    if (!process.client) return null
    
    try {
      // Check URL for phone parameter
      const urlParams = new URLSearchParams(window.location.search)
      const phoneFromUrl = urlParams.get('phone')
      
      if (phoneFromUrl) {
        console.log('🔗 Phone number found in URL, authenticating...')
        return await authenticateUser(phoneFromUrl)
      }
      
      // Check localStorage for stored phone
      const storedPhone = localStorage.getItem('userPhone')
      if (storedPhone) {
        console.log('💾 Stored phone number found, authenticating...')
        return await authenticateUser(storedPhone)
      }
      
      return null
    } catch (error) {
      console.error('Initialize from URL error:', error)
      return null
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    
    if (process.client) {
      localStorage.removeItem('userPhone')
    }
  }

  const needsBasketSetup = computed(() => {
    if (!user.value) return false
    return user.value.isFirstTime || 
           !user.value.selectedBoxSize || 
           !user.value.deliveryDay || 
           !user.value.householdSize
  })

  const hasCompleteProfile = computed(() => {
    if (!user.value) return false
    return !user.value.isFirstTime &&
           user.value.selectedBoxSize &&
           user.value.deliveryDay &&
           user.value.householdSize &&
           user.value.hasAddresses
  })

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    
    // Computed
    needsBasketSetup,
    hasCompleteProfile,
    
    // Methods
    authenticateUser,
    checkUserStatus,
    getUserProfile,
    updateBasketConfiguration,
    initializeFromURL,
    logout
  }
}