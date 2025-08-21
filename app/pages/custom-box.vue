<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container py-6">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="flex items-center text-aux-orange mb-4 hover:text-opacity-80"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="ml-2">Voltar</span>
        </button>
        <h1 class="text-2xl font-bold text-aux-black">Monte Sua Cesta Personalizada</h1>
        <p class="text-gray-600">Configure sua cesta semanal de acordo com suas necessidades</p>
      </div>

      <!-- Progress Bar -->
      <div class="bg-white rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-aux-black">Progresso</span>
          <span class="text-sm text-gray-500">{{ currentStep }}/{{ totalSteps }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-aux-orange h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Step 1: Household Information -->
      <div v-if="currentStep === 1" class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-xl font-semibold text-aux-black mb-4">Informações da Casa</h2>

        <div class="space-y-6">
          <!-- Number of People -->
          <div>
            <label class="block text-sm font-medium text-aux-black mb-3">
              Quantas pessoas moram na sua casa?
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="option in peopleOptions"
                :key="option.value"
                @click="formData.householdSize = option.value"
                :class="[
                  'p-4 rounded-lg border-2 text-center transition-all',
                  formData.householdSize === option.value
                    ? 'border-aux-orange bg-orange-50 text-aux-orange'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <div class="text-2xl mb-1">{{ option.icon }}</div>
                <div class="font-medium">{{ option.label }}</div>
                <div class="text-sm text-gray-500">{{ option.description }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Delivery Schedule -->
      <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-xl font-semibold text-aux-black mb-4">Dia de Entrega</h2>

        <div class="space-6">
          <!-- Delivery Day -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-aux-black mb-3">
              Qual dia da semana você prefere receber sua cesta?
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="day in deliveryDays"
                :key="day.value"
                @click="formData.deliveryDay = day.value"
                :class="[
                  'p-4 rounded-lg border-2 text-center transition-all',
                  formData.deliveryDay === day.value
                    ? 'border-aux-orange bg-orange-50 text-aux-orange'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <div class="font-medium">{{ day.label }}</div>
                <div class="text-sm text-gray-500">{{ day.time }}</div>
              </button>
            </div>
          </div>

          <!-- Important Notice -->
          <div class="bg-yellow border border-yellow-200 rounded-lg p-4 mt-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-yellow-600"
                >
                  <path
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div class="mt-3 ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Importante</h3>
                <p class="text-sm text-yellow-700 mt-1">
                  Você pode alterar os itens da sua cesta até
                  <strong>2 dias antes</strong>
                  da entrega. Após esse prazo, não será possível fazer modificações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Final Information -->
      <div v-if="currentStep === 3" class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-xl font-semibold text-aux-black mb-6">
          Como Funciona Sua Cesta Personalizada
        </h2>

        <div class="space-y-6">
          <!-- How it Works -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div
                class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-aux-orange"
                >
                  <path
                    d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-aux-black mb-2">1. Escolha dos Itens</h3>
              <p class="text-sm text-gray-600">
                Você receberá uma sugestão de cesta baseada no tamanho da sua família. Pode
                personalizar os itens até 2 dias antes da entrega.
              </p>
            </div>

            <div class="text-center">
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-green-600"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-aux-black mb-2">2. Entrega</h3>
              <p class="text-sm text-gray-600">
                Entregas toda {{ selectedDayLabel }} entre 8h e 18h. Você será notificado 1 hora
                antes da chegada do entregador.
              </p>
            </div>

            <div class="text-center">
              <div
                class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-blue-600"
                >
                  <path
                    d="M12 2V6M6.31412 6.31412L9.24264 9.24264M2 12H6M6.31412 17.6859L9.24264 14.7574M12 18V22M17.6859 17.6859L14.7574 14.7574M22 12H18M17.6859 6.31412L14.7574 9.24264"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-aux-black mb-2">3. Produtos Frescos</h3>
              <p class="text-sm text-gray-600">
                Todos os produtos são colhidos no máximo 24h antes da entrega, garantindo máxima
                frescura e qualidade.
              </p>
            </div>
          </div>

          <!-- Budget Information -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="font-semibold text-aux-black mb-3">💰 Valor da Sua Cesta</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-2">Baseado no tamanho da família:</p>
                <p class="text-2xl font-bold text-aux-orange">
                  R$ {{ estimatedBudget.toFixed(2) }}
                </p>
                <p class="text-sm text-gray-500">por semana</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-2">O que está incluso:</p>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• {{ estimatedItems }} itens variados</li>
                  <li>• Frutas e vegetais da estação</li>
                  <li>• Produtos orgânicos selecionados</li>
                  <li>• Entrega gratuita</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-aux-black mb-3">Resumo da Configuração</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Pessoas na casa:</span>
                <span class="font-medium">
                  {{ formData.householdSize }}
                  {{ formData.householdSize === 1 ? 'pessoa' : 'pessoas' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Dia de entrega:</span>
                <span class="font-medium">{{ selectedDayLabel }}</span>
              </div>
              <div v-if="formData.preferences.length > 0" class="flex justify-between">
                <span class="text-gray-600">Preferências:</span>
                <span class="font-medium">{{ formData.preferences.join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between">
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Anterior
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < totalSteps"
          @click="nextStep"
          :disabled="!canProceed"
          class="px-6 py-3 bg-aux-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo
        </button>
        <button
          v-else
          @click="finishSetup"
          class="px-6 py-3 bg-aux-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          Finalizar Configuração
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const router = useRouter()

const currentStep = ref(1)
const totalSteps = 3

const formData = ref({
  householdSize: null,
  preferences: [],
  deliveryDay: null,
})

const peopleOptions = [
  { value: 1, label: '1 pessoa', description: 'Só eu', icon: '👤' },
  { value: 2, label: '2 pessoas', description: 'Casal', icon: '👫' },
  { value: 3, label: '3-4 pessoas', description: 'Família pequena', icon: '👨‍👩‍👧' },
  { value: 5, label: '5+ pessoas', description: 'Família grande', icon: '👨‍👩‍👧‍👦' },
]

const dietaryPreferences = [
  { value: 'Orgânicos', label: 'Preferência por orgânicos' },
  { value: 'Vegetariano', label: 'Vegetariano' },
  { value: 'Vegano', label: 'Vegano' },
  { value: 'Sem glúten', label: 'Sem glúten' },
  { value: 'Frutas tropicais', label: 'Mais frutas tropicais' },
  { value: 'Verduras folhosas', label: 'Mais verduras folhosas' },
]

const deliveryDays = [
  { value: 'segunda', label: 'Segunda-feira', time: '8h às 18h' },
  { value: 'terca', label: 'Terça-feira', time: '8h às 18h' },
  { value: 'quarta', label: 'Quarta-feira', time: '8h às 18h' },
  { value: 'quinta', label: 'Quinta-feira', time: '8h às 18h' },
  { value: 'sexta', label: 'Sexta-feira', time: '8h às 18h' },
  { value: 'sabado', label: 'Sábado', time: '8h às 16h' },
]

const selectedDayLabel = computed(() => {
  const day = deliveryDays.find(d => d.value === formData.value.deliveryDay)
  return day ? day.label : ''
})

const boxPrices = ref([])

const fetchBoxPrices = async () => {
  try {
    // For public access, we'll use hardcoded values since the API requires admin auth
    // In a real app, you'd have a public endpoint for box prices
    boxPrices.value = [
      { profileType: 1, basePrice: 25.00, itemCount: 8 },
      { profileType: 2, basePrice: 45.00, itemCount: 14 },
      { profileType: 3, basePrice: 65.00, itemCount: 20 },
      { profileType: 5, basePrice: 85.00, itemCount: 26 }
    ]
  } catch (error) {
    console.error('Error fetching box prices:', error)
  }
}

const currentBoxPrice = computed(() => {
  const householdSize = formData.value.householdSize
  if (!householdSize || boxPrices.value.length === 0) return null
  
  // Find matching profile or use the closest one
  let profile = boxPrices.value.find(p => p.profileType === householdSize)
  if (!profile) {
    // Use largest profile for households bigger than 5
    if (householdSize > 5) {
      profile = boxPrices.value.find(p => p.profileType === 5)
    } else {
      // Use closest smaller profile
      profile = boxPrices.value
        .filter(p => p.profileType <= householdSize)
        .sort((a, b) => b.profileType - a.profileType)[0]
    }
  }
  return profile
})

const estimatedBudget = computed(() => {
  const profile = currentBoxPrice.value
  return profile ? profile.basePrice : 25
})

const estimatedItems = computed(() => {
  const profile = currentBoxPrice.value
  return profile ? profile.itemCount : 8
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return formData.value.householdSize !== null
  }
  if (currentStep.value === 2) {
    return formData.value.deliveryDay !== null
  }
  return true
})

const goBack = () => {
  router.back()
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const finishSetup = () => {
  // Save configuration
  console.log('Custom box configuration:', formData.value)

  // Here you would typically save to localStorage or send to API
  alert('Configuração salva com sucesso! Redirecionando para escolher produtos...')

  // Redirect to product selection or dashboard
  router.push('/')
}

onMounted(() => {
  fetchBoxPrices()
})
</script>
