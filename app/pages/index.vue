<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Returning User Offer Banner -->
    <div v-if="showOfferBanner" class="bg-gradient-to-r from-aux-orange to-orange-600 text-white">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="bg-white bg-opacity-20 rounded-full p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2L13.09 8.26L20 9L15 14.74L16.18 22L10 18.27L3.82 22L5 14.74L0 9L6.91 8.26L10 2Z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="font-semibold">Bem-vindo de volta! 🎉</p>
              <p class="text-sm opacity-90">{{ offerMessage }}</p>
            </div>
          </div>
          <button 
            @click="dismissOffer"
            class="text-white hover:text-opacity-80 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-aux-light-yellow">
      <section class="py-4 container mx-auto px-4">
        <h2 class="text-aux-black font-bold text-[32px]">Bom dia,</h2>
        <p class="font-light text-aux-black text-base">Alimentos direto da roça para você</p>
        <div class="flex items-center relative mt-6 lg:max-w-[320px]">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Pesquisar por nome"
            class="border border-aux-grey rounded-lg bg-white px-4 py-2 w-full"
            @input="handleSearch"
          />
          <SearchIcon class="absolute right-[15px]" />
        </div>
      </section>
    </div>

    <!-- Products Section -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <!-- Products Count -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-aux-black font-semibold text-lg">
              {{ searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os Produtos' }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ products.length }} produto{{ products.length !== 1 ? 's' : '' }} encontrado{{ products.length !== 1 ? 's' : '' }}
            </p>
          </div>
          <button
            v-if="searchTerm"
            @click="clearSearch"
            class="text-aux-orange text-sm hover:text-opacity-80"
          >
            Limpar busca
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-aux-orange border-t-transparent mb-4"></div>
          <h3 class="text-gray-900 font-semibold mb-2">Carregando produtos...</h3>
          <p class="text-gray-600">Aguarde um momento</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-gray-900 font-semibold mb-2">Ops! Algo deu errado</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="loadProducts"
            class="bg-aux-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && products.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <SearchIcon color="#9CA3AF" />
          </div>
          <h3 class="text-gray-900 font-semibold mb-2">Nenhum produto encontrado</h3>
          <p class="text-gray-600 mb-4">
            {{ searchTerm ? `Não encontramos produtos com "${searchTerm}"` : 'Nenhum produto disponível no momento' }}
          </p>
          <button
            v-if="searchTerm"
            @click="clearSearch"
            class="text-aux-orange hover:text-opacity-80"
          >
            Limpar busca
          </button>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @quantity-changed="handleQuantityChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import SearchIcon from '~/components/icons/SearchIcon.vue'
import ProductCard from '~/components/ProductCard.vue'

// Reactive state
const allProducts = ref([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')

// Computed filtered products
const products = computed(() => {
  if (!searchTerm.value.trim()) {
    return allProducts.value
  }
  
  const search = searchTerm.value.toLowerCase().trim()
  return allProducts.value.filter(product => 
    product.name?.toLowerCase().includes(search) ||
    product.description?.toLowerCase().includes(search) ||
    product.category?.toLowerCase().includes(search)
  )
})

// Load products function
const loadProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔍 Loading products from API...')
    
    const config = useRuntimeConfig()
    const apiUrl = `${config.public.apiBaseUrl}/api/products`
    
    console.log('🌐 API URL:', apiUrl)
    
    const response = await $fetch(apiUrl)
    console.log('📦 Raw API Response:', response)
    
    if (response && response.products && Array.isArray(response.products)) {
      // API returns {products: [...]}
      allProducts.value = response.products
      console.log('✅ Products loaded successfully:', response.products.length)
    } else if (response && Array.isArray(response)) {
      // API returns products directly as array
      allProducts.value = response
      console.log('✅ Products loaded (direct array):', response.length)
    } else {
      console.warn('⚠️ Unexpected API response structure:', response)
      throw new Error('Formato de resposta inesperado')
    }
    
  } catch (err) {
    console.error('❌ Error loading products:', err)
    error.value = 'Não foi possível carregar os produtos. Verifique sua conexão.'
    allProducts.value = []
  } finally {
    loading.value = false
  }
}

// Search handling
const handleSearch = () => {
  // Trigger reactivity for search filtering
  console.log('🔍 Searching for:', searchTerm.value)
}

const clearSearch = () => {
  searchTerm.value = ''
  console.log('🗑️ Search cleared')
}

// Quantity change handling
const handleQuantityChange = (data) => {
  console.log('📦 Product quantity changed:', data)
}

// Load products on mount
onMounted(() => {
  console.log('🚀 Component mounted, loading products...')
  loadProducts()
})

// Offer banner logic for returning users
const { getUserVisitData } = useUserTracking()
const showOfferBanner = ref(false)
const offerMessage = ref('')

onMounted(() => {
  const visitData = getUserVisitData()
  if (visitData && visitData.visitCount > 1) {
    showOfferBanner.value = true
    const messages = [
      'Descontos especiais hoje! Confira nossa seleção premium.',
      'Frete grátis em pedidos acima de R$ 50 nesta semana!',
      'Novos produtos frescos chegaram! Veja as novidades.',
      '10% de desconto para clientes fiéis como você!'
    ]
    offerMessage.value = messages[Math.floor(Math.random() * messages.length)]
  }
})

const dismissOffer = () => {
  showOfferBanner.value = false
}

// SEO
useHead({
  title: 'Feiraja - Produtos Frescos da Roça',
  meta: [
    { name: 'description', content: 'Encontre os melhores produtos frescos direto da roça.' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Ensure proper grid spacing */
.grid {
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .grid {
    gap: 2rem;
  }
}
</style>