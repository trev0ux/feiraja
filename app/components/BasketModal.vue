<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-end justify-center md:items-center"
    @click="closeModal"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    
    <!-- Modal Content -->
    <div
      class="relative bg-white flex flex-col rounded-t-xl md:rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-aux-black">Carrinho</h2>
          <button
            @click="closeModal"
            class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div v-if="basketItems.length > 0" class="space-y-2">
          <div class="flex justify-between text-xs text-gray-600">
            <span>Capacidade da cesta</span>
            <span>{{ totalItems }}/{{ maxCapacity }} itens</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300 ease-out"
              :class="progressBarColor"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <p class="text-xs text-gray-500">
            {{ remainingCapacity > 0 ? `Ainda cabem ${remainingCapacity} itens` : 'Cesta cheia!' }}
          </p>
        </div>
      </div>

      <!-- Basket Items -->
      <div class="flex-1 overflow-y-auto max-h-96">
        <div v-if="basketItems.length === 0" class="p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <BasketIcon color="#9CA3AF" />
          </div>
          <p class="text-gray-500 mb-2">Seu carrinho está vazio</p>
          <p class="text-sm text-gray-400">Adicione produtos para começar</p>
        </div>

        <div v-else class="p-4 space-y-4">
          <div
            v-for="item in basketItems"
            :key="item.product.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <h3 class="font-medium text-aux-black text-sm">{{ item.product.name }}</h3>
              <p class="text-aux-orange font-semibold text-sm">R$ {{ item.product.price.toFixed(2) }}</p>
            </div>
            
            <div class="flex items-center gap-3">
              <button
                @click="updateQuantity(item.product.id, item.quantity - 1)"
                class="w-8 h-8 bg-white border border-gray-300 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              
              <span class="font-semibold text-aux-black min-w-[20px] text-center">{{ item.quantity }}</span>
              
              <button
                @click="updateQuantity(item.product.id, item.quantity + 1)"
                class="w-8 h-8 bg-aux-orange text-white rounded-full flex items-center justify-center hover:bg-opacity-90"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="basketItems.length > 0" class="border-t border-gray-200 p-4 space-y-4">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-aux-black">Total:</span>
          <span class="font-bold text-lg text-aux-orange">R$ {{ totalPrice.toFixed(2) }}</span>
        </div>
        
        <!-- Error Message -->
        <div v-if="authError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ authError }}</p>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="clearCart"
            class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Limpar Carrinho
          </button>
          <button 
            @click="goToCheckout"
            :disabled="isCheckingAuth"
            class="flex-2 bg-aux-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            <span v-if="isCheckingAuth" class="absolute left-3 top-1/2 transform -translate-y-1/2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </span>
            {{ isCheckingAuth ? 'Verificando...' : 'Finalizar Pedido' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BasketIcon from './icons/BasketIcon.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  basketItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'updateQuantity', 'clearCart'])
const router = useRouter()
const { apiCall } = useApi()

// Authentication state
const isCheckingAuth = ref(false)
const authError = ref('')

const closeModal = () => {
  emit('close')
}

const clearCart = () => {
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
    emit('clearCart')
  }
}

const updateQuantity = (productId, newQuantity) => {
  emit('updateQuantity', { productId, quantity: newQuantity })
}

const goToCheckout = async () => {
  if (props.basketItems.length === 0) return
  
  isCheckingAuth.value = true
  authError.value = ''
  
  try {
    // Check if user is already authenticated
    const user = useAuthUser()
    
    if (user.value) {
      // User is authenticated, proceed to address/checkout
      emit('close')
      
      if (user.value.hasAddresses) {
        router.push('/manage-address')
      } else {
        router.push('/address')
      }
    } else {
      // User needs authentication, redirect to WhatsApp login with return URL
      emit('close')
      router.push({
        path: '/login',
        query: { redirect: '/address' }
      })
    }
  } catch (error) {
    console.error('Checkout error:', error)
    authError.value = 'Erro ao verificar autenticação. Tente novamente.'
  } finally {
    isCheckingAuth.value = false
  }
}

const maxCapacity = 20 // Maximum items the basket can hold

const totalItems = computed(() => {
  return props.basketItems.reduce((total, item) => total + item.quantity, 0)
})

const totalPrice = computed(() => {
  return props.basketItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
})

const progressPercentage = computed(() => {
  return Math.min((totalItems.value / maxCapacity) * 100, 100)
})

const remainingCapacity = computed(() => {
  return Math.max(maxCapacity - totalItems.value, 0)
})

const progressBarColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage >= 100) return 'bg-red-500'
  if (percentage >= 80) return 'bg-yellow-500'
  if (percentage >= 50) return 'bg-orange-500'
  return 'bg-green-500'
})
</script>