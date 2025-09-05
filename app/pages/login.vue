<template>
  <div>
    <!-- WhatsApp Login Step -->
    <WhatsAppLogin
      v-if="currentStep === 'login'"
      @userAuthenticated="handleUserAuthenticated"
      @requiresRegistration="handleRequiresRegistration"
    />

    <!-- User Registration Step -->
    <UserRegistration
      v-else-if="currentStep === 'registration'"
      :phoneNumber="registrationData.phoneNumber"
      @registrationComplete="handleRegistrationComplete"
      @goBack="currentStep = 'login'"
    />

    <!-- Basket Configuration Step -->
    <BasketConfiguration
      v-else-if="currentStep === 'basket-config'"
      :userData="registrationData"
      @configurationComplete="handleConfigurationComplete"
      @goBack="currentStep = 'registration'"
    />

    <!-- Success Message -->
    <div v-else-if="currentStep === 'success'" class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <LogoIcon :width="80" :height="88" />
        </div>
        <div class="mt-6 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
              Bem-vindo à Feirajá!
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              Seu cadastro foi realizado com sucesso. Agora você pode explorar nossos produtos frescos.
            </p>
            <button
              @click="goToProducts"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-aux-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange"
            >
              Explorar Produtos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import WhatsAppLogin from '~/components/auth/WhatsAppLogin.vue'
import UserRegistration from '~/components/auth/UserRegistration.vue'
import BasketConfiguration from '~/components/auth/BasketConfiguration.vue'
import LogoIcon from '~/components/icons/LogoIcon.vue'

definePageMeta({
  layout: false,
})

const router = useRouter()
const route = useRoute()
const currentStep = ref('login')
const registrationData = ref({})

// Get redirect URL from query params
const redirectTo = computed(() => route.query.redirect || '/')

// Handle existing user authentication
const handleUserAuthenticated = (user) => {
  console.log('User authenticated:', user)
  
  // Store user data in localStorage/cookie for session management
  const userSession = useCookie('user-session', {
    default: () => null,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  
  userSession.value = user
  
  // Redirect to original destination or home page
  router.push(redirectTo.value)
}

// Handle new user registration flow
const handleRequiresRegistration = (data) => {
  console.log('User requires registration:', data)
  registrationData.value = {
    phoneNumber: data.phoneNumber,
    cleanedPhone: data.cleanedPhone
  }
  currentStep.value = 'registration'
}

// Handle registration form completion
const handleRegistrationComplete = (userData) => {
  console.log('Registration data collected:', userData)
  registrationData.value = {
    ...registrationData.value,
    ...userData
  }
  currentStep.value = 'basket-config'
}

// Handle basket configuration completion
const handleConfigurationComplete = (user) => {
  console.log('Configuration complete, user created:', user)
  
  // Store user data in localStorage/cookie for session management
  const userSession = useCookie('user-session', {
    default: () => null,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  
  userSession.value = user
  
  // If redirect is specified, go there directly, otherwise show success page
  if (redirectTo.value !== '/') {
    router.push(redirectTo.value)
  } else {
    currentStep.value = 'success'
  }
}

// Navigate to products page
const goToProducts = () => {
  router.push('/')
}

// Check if user is already logged in and redirect
onMounted(() => {
  const userSession = useCookie('user-session')
  if (userSession.value) {
    router.push('/')
  }
})
</script>