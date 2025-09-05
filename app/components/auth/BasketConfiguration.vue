<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="flex justify-center">
        <LogoIcon :width="60" :height="66" />
      </div>
      <h2 class="mt-4 text-center text-2xl font-extrabold text-gray-900">
        Configure sua cesta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Escolha o tamanho ideal para sua família
      </p>
      
      <!-- Progress indicator -->
      <div class="mt-4 flex justify-center">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-aux-orange rounded-full"></div>
          <div class="w-8 h-0.5 bg-aux-orange"></div>
          <div class="w-3 h-3 bg-aux-orange rounded-full"></div>
          <div class="w-8 h-0.5 bg-aux-orange"></div>
          <div class="w-3 h-3 bg-aux-orange rounded-full"></div>
        </div>
      </div>
      <p class="mt-2 text-center text-xs text-gray-500">Etapa 3 de 3</p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Box Size Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-4">
              Tamanho da cesta *
            </label>
            <div class="space-y-3">
              <div
                v-for="box in boxPrices"
                :key="box.id"
                @click="form.selectedBoxSize = box.profileType"
                class="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none"
                :class="[
                  form.selectedBoxSize === box.profileType
                    ? 'border-aux-orange bg-aux-orange bg-opacity-5'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                ]"
              >
                <div class="flex flex-1">
                  <div class="flex flex-col">
                    <span class="block text-sm font-medium text-gray-900">
                      {{ box.name }}
                    </span>
                    <span class="block text-sm text-gray-500">
                      Aproximadamente {{ box.itemCount }} itens
                    </span>
                    <span class="block text-lg font-bold text-aux-orange mt-1">
                      R$ {{ (box.basePrice && typeof box.basePrice === 'number') ? box.basePrice.toFixed(2) : '0.00' }}
                    </span>
                  </div>
                </div>
                <div
                  v-if="form.selectedBoxSize === box.profileType"
                  class="flex-shrink-0 text-aux-orange"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Household Size -->
          <div>
            <label for="householdSize" class="block text-sm font-medium text-gray-700">
              Quantas pessoas moram com você? *
            </label>
            <div class="mt-1">
              <select
                id="householdSize"
                v-model="form.householdSize"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
              >
                <option value="">Selecione</option>
                <option value="1">1 pessoa</option>
                <option value="2">2 pessoas</option>
                <option value="3">3 pessoas</option>
                <option value="4">4 pessoas</option>
                <option value="5">5+ pessoas</option>
              </select>
            </div>
          </div>

          <!-- Delivery Day -->
          <div>
            <label for="deliveryDay" class="block text-sm font-medium text-gray-700">
              Dia preferido para entrega *
            </label>
            <div class="mt-1">
              <select
                id="deliveryDay"
                v-model="form.deliveryDay"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
              >
                <option value="">Selecione</option>
                <option value="Terça-feira">Terça-feira</option>
                <option value="Quarta-feira">Quarta-feira</option>
                <option value="Quinta-feira">Quinta-feira</option>
                <option value="Sexta-feira">Sexta-feira</option>
                <option value="Sábado">Sábado</option>
              </select>
            </div>
          </div>

          <!-- Preferences -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Preferências alimentares (opcional)
            </label>
            <div class="space-y-2">
              <label
                v-for="preference in availablePreferences"
                :key="preference"
                class="flex items-center"
              >
                <input
                  v-model="selectedPreferences"
                  :value="preference"
                  type="checkbox"
                  class="h-4 w-4 text-aux-orange focus:ring-aux-orange border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">{{ preference }}</span>
              </label>
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
              {{ isLoading ? 'Finalizando...' : 'Finalizar Cadastro' }}
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

        <!-- Back Button -->
        <div class="mt-4 text-center">
          <button
            @click="emit('goBack')"
            type="button"
            class="text-sm text-aux-orange hover:text-opacity-80"
          >
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LogoIcon from '~/components/icons/LogoIcon.vue'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['configurationComplete', 'goBack'])
const { apiCall } = useApi()

// Reactive data
const isLoading = ref(false)
const error = ref('')
const boxPrices = ref([])
const selectedPreferences = ref([])

const form = reactive({
  selectedBoxSize: null,
  householdSize: '',
  deliveryDay: ''
})

const availablePreferences = [
  'Sem frutas ácidas',
  'Sem folhas verdes',
  'Preferência por orgânicos',
  'Sem raízes (batata, cenoura)',
  'Vegetariano',
  'Vegano'
]

// Computed
const isFormValid = computed(() => {
  return (
    form.selectedBoxSize &&
    form.householdSize &&
    form.deliveryDay
  )
})

// Fetch box prices on mount
onMounted(async () => {
  try {
    const response = await apiCall('/api/admin/box-prices')
    console.log('API response:', response)
    // Check if response is an array or if it's nested
    if (Array.isArray(response)) {
      boxPrices.value = response
    } else if (response.data && Array.isArray(response.data)) {
      boxPrices.value = response.data
    } else if (response.boxPrices && Array.isArray(response.boxPrices)) {
      boxPrices.value = response.boxPrices
    } else {
      console.error('Unexpected response format:', response)
      // Use fallback data
      boxPrices.value = [
        { id: 1, profileType: 1, name: '1 pessoa', basePrice: 35.0, itemCount: 8 },
        { id: 2, profileType: 2, name: '2 pessoas', basePrice: 55.0, itemCount: 14 },
        { id: 3, profileType: 3, name: '3-4 pessoas', basePrice: 75.0, itemCount: 20 },
        { id: 4, profileType: 5, name: '5+ pessoas', basePrice: 95.0, itemCount: 26 }
      ]
    }
  } catch (err) {
    console.error('Failed to fetch box prices:', err)
    // Fallback data
    boxPrices.value = [
      { id: 1, profileType: 1, name: '1 pessoa', basePrice: 35.0, itemCount: 8 },
      { id: 2, profileType: 2, name: '2 pessoas', basePrice: 55.0, itemCount: 14 },
      { id: 3, profileType: 3, name: '3-4 pessoas', basePrice: 75.0, itemCount: 20 },
      { id: 4, profileType: 5, name: '5+ pessoas', basePrice: 95.0, itemCount: 26 }
    ]
  }
})

// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const registrationData = {
      ...props.userData,
      selectedBoxSize: form.selectedBoxSize,
      householdSize: parseInt(form.householdSize),
      deliveryDay: form.deliveryDay,
      preferences: selectedPreferences.value.length > 0 ? selectedPreferences.value : null
    }

    const response = await apiCall('/api/whatsapp/register', {
      method: 'POST',
      body: registrationData
    })
    
    if (response.success) {
      emit('configurationComplete', response.user)
    }
    
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.data?.error || 'Erro ao finalizar cadastro. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>