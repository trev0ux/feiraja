<script setup lang="ts">
import BasketIcon from './icons/BasketIcon.vue'
import LogoIcon from './icons/LogoIcon.vue'
import BasketModal from './BasketModal.vue'

const props = defineProps({
  basketItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['updateQuantity', 'clearCart'])
const router = useRouter()

const isBasketModalOpen = ref(false)
const showUserMenu = ref(false)

// User session management
const userSession = useCookie('user-session', {
  default: () => null,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 30, // 30 days
})

const user = computed(() => userSession.value)
const isLoggedIn = computed(() => !!user.value)

const openBasketModal = () => {
  isBasketModalOpen.value = true
}

const closeBasketModal = () => {
  isBasketModalOpen.value = false
}

const handleUpdateQuantity = (data) => {
  emit('updateQuantity', data)
}

const handleClearCart = () => {
  emit('clearCart')
}

const totalItems = computed(() => {
  return props.basketItems.reduce((total, item) => total + item.quantity, 0)
})

const goToLogin = () => {
  router.push('/login')
}

const logout = () => {
  userSession.value = null
  showUserMenu.value = false
  router.push('/')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Close user menu when clicking outside
const userMenuRef = ref(null)
onMounted(() => {
  const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      showUserMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <header class="bg-aux-light-yellow">
    <div class="container py-4 flex justify-between items-center">
      <NuxtLink to="/" class="flex font-grotesque items-center gap-2 text-aux-black text-lg font-black">
        <LogoIcon />
        Feirajá
      </NuxtLink>

      <div class="flex items-center gap-3">
        <!-- User Authentication -->
        <div v-if="!isLoggedIn">
          <button
            @click="goToLogin"
            class="text-aux-black hover:text-aux-orange transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            Autenticar
          </button>
        </div>

        <!-- User Menu -->
        <div v-else class="relative" ref="userMenuRef">
          <button
            @click="toggleUserMenu"
            class="text-aux-black hover:text-aux-orange transition-colors text-sm font-medium flex items-center gap-2"
          >
            <div class="w-8 h-8 bg-aux-orange text-white rounded-full flex items-center justify-center text-xs font-bold">
              {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <span class="hidden sm:block">{{ user.name || 'Usuário' }}</span>
            <svg class="w-4 h-4" :class="{ 'rotate-180': showUserMenu }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
          >
            <div class="px-4 py-2 border-b">
              <p class="text-sm font-medium text-gray-900">{{ user.name || 'Usuário' }}</p>
              <p class="text-xs text-gray-500">{{ user.phoneNumber }}</p>
            </div>
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>

        <!-- Basket Button -->
        <button
          type="button"
          aria-label="Carrinho"
          class="bg-aux-orange text-white rounded-full gap-2 flex items-center text-sm p-2 hover:bg-opacity-90 transition-colors"
          @click="openBasketModal"
        >
          <BasketIcon />
          {{ totalItems }}
        </button>
      </div>
    </div>
    
    <!-- Basket Modal -->
    <BasketModal
      :is-open="isBasketModalOpen"
      :basket-items="basketItems"
      @close="closeBasketModal"
      @update-quantity="handleUpdateQuantity"
      @clear-cart="handleClearCart"
    />
  </header>
</template>
