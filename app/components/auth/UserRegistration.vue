<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <LogoIcon :width="60" :height="66" />
      </div>
      <h2 class="mt-4 text-center text-2xl font-extrabold text-gray-900">
        Complete seu cadastro
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Última etapa para acessar produtos frescos
      </p>
      
      <!-- Progress indicator -->
      <div class="mt-4 flex justify-center">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-aux-orange rounded-full"></div>
          <div class="w-8 h-0.5 bg-aux-orange"></div>
          <div class="w-3 h-3 bg-aux-orange rounded-full"></div>
          <div class="w-8 h-0.5 bg-gray-300"></div>
          <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <p class="mt-2 text-center text-xs text-gray-500">Etapa 2 de 3</p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-8">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nome -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nome completo *
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email (opcional)
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                placeholder="Para nota fiscal (opcional)"
              />
            </div>
          </div>

          <!-- CEP -->
          <div>
            <label for="cep" class="block text-sm font-medium text-gray-700">
              CEP *
            </label>
            <div class="mt-1">
              <input
                id="cep"
                v-model="form.address.zipCode"
                type="text"
                required
                maxlength="9"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                placeholder="00000-000"
                @input="formatCep"
                @blur="fetchAddressFromCep"
              />
            </div>
            <p v-if="addressError" class="mt-1 text-sm text-red-600">{{ addressError }}</p>
          </div>

          <!-- Address fields (auto-filled from CEP) -->
          <div v-if="form.address.street" class="space-y-4">
            <div>
              <label for="street" class="block text-sm font-medium text-gray-700">
                Endereço *
              </label>
              <div class="mt-1">
                <input
                  id="street"
                  v-model="form.address.street"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                  placeholder="Rua, número"
                />
              </div>
            </div>

            <div>
              <label for="complement" class="block text-sm font-medium text-gray-700">
                Complemento
              </label>
              <div class="mt-1">
                <input
                  id="complement"
                  v-model="form.address.complement"
                  type="text"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                  placeholder="Apto, casa, etc."
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="neighborhood" class="block text-sm font-medium text-gray-700">
                  Bairro *
                </label>
                <div class="mt-1">
                  <input
                    id="neighborhood"
                    v-model="form.address.neighborhood"
                    type="text"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="city" class="block text-sm font-medium text-gray-700">
                  Cidade *
                </label>
                <div class="mt-1">
                  <input
                    id="city"
                    v-model="form.address.city"
                    type="text"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-aux-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
              {{ isLoading ? 'Verificando entrega...' : 'Continuar' }}
            </button>
          </div>
        </form>

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

const props = defineProps({
  phoneNumber: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['registrationComplete', 'goBack'])

// Reactive data
const isLoading = ref(false)
const error = ref('')
const addressError = ref('')

const form = reactive({
  name: '',
  email: '',
  address: {
    zipCode: '',
    street: '',
    neighborhood: '',
    city: '',
    state: 'SP', // Default to São Paulo
    complement: '',
    reference: '',
    name: 'Casa'
  }
})

// Computed
const isFormValid = computed(() => {
  return (
    form.name.trim().length > 0 &&
    form.address.zipCode.length >= 9 &&
    form.address.street.trim().length > 0 &&
    form.address.neighborhood.trim().length > 0 &&
    form.address.city.trim().length > 0
  )
})

// Format CEP input
const formatCep = () => {
  let value = form.address.zipCode.replace(/\D/g, '')
  
  if (value.length > 8) {
    value = value.slice(0, 8)
  }
  
  if (value.length > 5) {
    value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2')
  }
  
  form.address.zipCode = value
}

// Fetch address from CEP using ViaCEP API
const fetchAddressFromCep = async () => {
  const cep = form.address.zipCode.replace(/\D/g, '')
  
  if (cep.length !== 8) {
    return
  }
  
  try {
    addressError.value = ''
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      addressError.value = 'CEP não encontrado'
      return
    }
    
    // Check if we deliver to this area (São Paulo for now)
    if (data.uf !== 'BA') {
      addressError.value = 'Ainda não entregamos nesta região'
      return
    }
    
    form.address.street = data.logradouro || ''
    form.address.neighborhood = data.bairro || ''
    form.address.city = data.localidade || ''
    form.address.state = data.uf || 'SP'
    
  } catch (err) {
    console.error('CEP fetch error:', err)
    addressError.value = 'Erro ao buscar CEP'
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    // Emit registration data to parent
    emit('registrationComplete', {
      phoneNumber: props.phoneNumber,
      name: form.name,
      email: form.email || undefined,
      address: {
        name: form.address.name,
        street: form.address.street,
        neighborhood: form.address.neighborhood,
        city: form.address.city,
        state: form.address.state,
        zipCode: form.address.zipCode,
        complement: form.address.complement || undefined,
        reference: form.address.reference || undefined
      }
    })
    
  } catch (err) {
    console.error('Registration error:', err)
    error.value = 'Erro ao processar cadastro. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>