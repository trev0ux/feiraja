<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <LogoIcon :width="80" :height="88" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Entrar via WhatsApp
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Rápido, seguro e sem senhas
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Step 1: Phone Number Input -->
        <div v-if="currentStep === 'phone'" class="space-y-6">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Número do WhatsApp
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="phoneNumber"
                type="tel"
                placeholder="(11) 99999-9999"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                @input="formatPhoneNumber"
              />
            </div>
          </div>

          <div>
            <button
              @click="handlePhoneSubmit"
              :disabled="isLoading || !isValidPhone"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-aux-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
              <svg v-if="!isLoading" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12.051 2C6.502 2 2.001 6.502 2.001 12.051c0 1.736.445 3.366 1.226 4.786L2.051 22l5.302-1.224c1.355.739 2.892 1.133 4.698 1.133 5.549 0 10.051-4.502 10.051-10.051S17.6 2 12.051 2zm0 18.103c-1.547 0-2.977-.403-4.236-1.108l-.303-.18-3.148.727.753-2.761-.191-.296c-.77-1.217-1.175-2.634-1.175-4.134 0-4.442 3.609-8.051 8.051-8.051s8.051 3.609 8.051 8.051-3.609 8.051-8.051 8.051z"/>
              </svg>
              {{ isLoading ? 'Verificando...' : 'Continuar com WhatsApp' }}
            </button>
          </div>
        </div>

        <!-- Step 2: Code Verification -->
        <div v-else-if="currentStep === 'verification'" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Código enviado!</h3>
            <p class="text-sm text-gray-600 mb-4">
              Enviamos um código de 6 dígitos para seu WhatsApp
              <span class="font-medium">{{ formattedPhone }}</span>
            </p>
            
            <!-- Success Message -->
            <div class="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">
                    Código enviado!
                  </p>
                  <p class="text-sm text-green-700 mt-1">
                    Verifique seu WhatsApp e insira o código de 6 dígitos abaixo.
                  </p>
                </div>
              </div>
            </div>

            <label for="code" class="block text-sm font-medium text-gray-700">
              Cole o código aqui
            </label>
            <div class="mt-1">
              <input
                id="code"
                v-model="verificationCode"
                type="text"
                placeholder="123456"
                maxlength="6"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm text-center text-lg font-mono tracking-widest"
                @input="formatCode"
              />
            </div>
          </div>

          <div>
            <button
              @click="handleCodeVerification"
              :disabled="isLoading || !isValidCode"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-aux-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
              {{ isLoading ? 'Verificando...' : 'Verificar Código' }}
            </button>
          </div>

          <div class="text-center">
            <button
              @click="currentStep = 'phone'"
              class="text-sm text-aux-orange hover:text-opacity-80"
            >
              ← Alterar número
            </button>
          </div>

          <!-- Timer -->
          <div v-if="timeLeft > 0" class="text-center text-sm text-gray-500">
            Código expira em {{ Math.floor(timeLeft / 60) }}:{{ String(timeLeft % 60).padStart(2, '0') }}
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="mt-4 rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Erro</h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LogoIcon from '~/components/icons/LogoIcon.vue'

const emit = defineEmits(['userAuthenticated', 'requiresRegistration'])
const { apiCall } = useApi()

// Reactive data
const currentStep = ref('phone')
const phoneNumber = ref('')
const verificationCode = ref('')
const isLoading = ref(false)
const error = ref('')
const whatsappLink = ref('')
const timeLeft = ref(0)

// Computed properties
const isValidPhone = computed(() => {
  const cleaned = phoneNumber.value.replace(/\D/g, '')
  return cleaned.length === 11
})

const isValidCode = computed(() => {
  return verificationCode.value.length === 6 && /^\d{6}$/.test(verificationCode.value)
})

const formattedPhone = computed(() => {
  const cleaned = phoneNumber.value.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phoneNumber.value
})

// Format phone number input
const formatPhoneNumber = () => {
  let value = phoneNumber.value.replace(/\D/g, '')
  
  if (value.length > 11) {
    value = value.slice(0, 11)
  }
  
  if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2')
  } else if (value.length > 0) {
    value = value.replace(/(\d{0,2})/, '($1')
  }
  
  phoneNumber.value = value
}

// Format verification code input
const formatCode = () => {
  verificationCode.value = verificationCode.value.replace(/\D/g, '').slice(0, 6)
}

// Start countdown timer
const startTimer = (seconds) => {
  timeLeft.value = seconds
  const timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Handle phone number submission
const handlePhoneSubmit = async () => {
  if (!isValidPhone.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const cleanedPhone = phoneNumber.value.replace(/\D/g, '')
    
    // Send code directly (the backend will handle user check)
    const codeResponse = await apiCall('/api/whatsapp/send-code', {
      method: 'POST',
      body: { phoneNumber: cleanedPhone }
    })
    
    whatsappLink.value = codeResponse.whatsappLink
    currentStep.value = 'verification'
    startTimer(codeResponse.expiresIn || 300)
  } catch (err) {
    console.error('Phone submit error:', err)
    error.value = err.data?.error || 'Erro ao enviar código. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

// Handle code verification
const handleCodeVerification = async () => {
  if (!isValidCode.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const cleanedPhone = phoneNumber.value.replace(/\D/g, '')
    
    const response = await apiCall('/api/whatsapp/verify-code', {
      method: 'POST',
      body: { 
        phoneNumber: cleanedPhone,
        code: verificationCode.value 
      }
    })
    
    if (response.success) {
      if (response.userExists && !response.requiresRegistration) {
        // Existing user - authenticate
        emit('userAuthenticated', response.user)
      } else {
        // New user - requires registration
        emit('requiresRegistration', {
          phoneNumber: response.phoneNumber,
          cleanedPhone
        })
      }
    }
  } catch (err) {
    console.error('Code verification error:', err)
    error.value = err.data?.error || 'Código inválido ou expirado'
  } finally {
    isLoading.value = false
  }
}
</script>