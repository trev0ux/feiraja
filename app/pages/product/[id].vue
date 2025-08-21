<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aux-orange mb-4"></div>
        <p class="text-gray-600">Carregando produto...</p>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Produto não encontrado</h2>
        <p class="text-gray-600 mb-4">O produto que você está procurando não existe.</p>
        <NuxtLink to="/" class="text-aux-orange hover:text-aux-orange/80">
          ← Voltar para a página inicial
        </NuxtLink>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else>
      <!-- Header with Back Button -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <NuxtLink to="/" class="text-aux-orange hover:text-aux-orange/80">
              Ver mais produtos
            </NuxtLink>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12">
          <!-- Product Image -->
          <div class="mb-8 lg:mb-0">
            <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                v-if="product.image"
                :src="`${$config.public.apiBaseUrl}${product.image}`"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Basic Info -->
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
              <p class="text-lg text-gray-600 mb-4">{{ product.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-3xl font-bold text-aux-orange">R$ {{ product.price.toFixed(2) }}</span>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.inStock ? 'Em estoque' : 'Indisponível' }}
                </span>
              </div>
            </div>

            <!-- Add to Cart -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-medium">Quantidade:</span>
                <div class="flex items-center space-x-3">
                  <button
                    @click="decreaseQuantity"
                    :disabled="quantity <= 0"
                    class="w-10 h-10 rounded-full border border-aux-orange text-aux-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:bg-aux-orange hover:text-white transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="text-xl font-semibold min-w-[2rem] text-center">{{ quantity }}</span>
                  <button
                    @click="increaseQuantity"
                    class="w-10 h-10 rounded-full bg-aux-orange text-white flex items-center justify-center hover:bg-aux-orange/90 transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="quantity > 0" class="text-right text-lg font-semibold text-gray-900">
                Total: R$ {{ (product.price * quantity).toFixed(2) }}
              </div>
            </div>

            <!-- Origin Information -->
            <div v-if="product.origin" class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Origem do Produto
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Produtor</dt>
                  <dd class="text-base text-gray-900">{{ product.origin.producer }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Localização</dt>
                  <dd class="text-base text-gray-900">{{ product.origin.location }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Distância</dt>
                  <dd class="text-base text-gray-900">{{ product.origin.distance }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Colheita</dt>
                  <dd class="text-base text-gray-900">{{ formatDate(product.origin.harvestDate) }}</dd>
                </div>
              </div>

              <!-- Certifications -->
              <div v-if="product.origin.certifications?.length" class="mb-4">
                <dt class="text-sm font-medium text-gray-500 mb-2">Certificações</dt>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="cert in product.origin.certifications"
                    :key="cert"
                    class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {{ cert }}
                  </span>
                </div>
              </div>

              <!-- Producer Story -->
              <div v-if="product.origin.story" class="border-t pt-4">
                <dt class="text-sm font-medium text-gray-500 mb-2">História do Produtor</dt>
                <dd class="text-base text-gray-700 leading-relaxed">{{ product.origin.story }}</dd>
              </div>
            </div>

            <!-- Nutritional Information -->
            <div v-if="product.nutritionalInfo" class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Informação Nutricional
              </h3>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Porção</dt>
                  <dd class="text-base font-semibold text-gray-900">{{ product.nutritionalInfo.portion }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Calorias</dt>
                  <dd class="text-base font-semibold text-gray-900">{{ product.nutritionalInfo.calories }} kcal</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Carboidratos</dt>
                  <dd class="text-base font-semibold text-gray-900">{{ product.nutritionalInfo.carbs }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Fibras</dt>
                  <dd class="text-base font-semibold text-gray-900">{{ product.nutritionalInfo.fiber }}</dd>
                </div>
              </div>

              <!-- Vitamins -->
              <div v-if="product.nutritionalInfo.vitamins?.length">
                <dt class="text-sm font-medium text-gray-500 mb-2">Rica em</dt>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="vitamin in product.nutritionalInfo.vitamins"
                    :key="vitamin"
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {{ vitamin }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { $config } = useNuxtApp()

const productId = computed(() => parseInt(route.params.id))
const loading = ref(true)
const product = ref(null)
const quantity = ref(0)

// Fetch product details
const fetchProduct = async () => {
  loading.value = true
  try {
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/products`)
    product.value = response.products.find(p => p.id === productId.value)
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Quantity controls
const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 0) {
    quantity.value--
  }
}

// Navigation
const goBack = () => {
  router.back()
}

// Meta tags for SEO
useSeoMeta({
  title: () => product.value ? `${product.value.name} - Feiraja` : 'Produto - Feiraja',
  ogTitle: () => product.value ? `${product.value.name} - Feiraja` : 'Produto - Feiraja',
  description: () => product.value ? product.value.description : 'Detalhes do produto',
  ogDescription: () => product.value ? product.value.description : 'Detalhes do produto',
})

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
/* Custom animations for smooth quantity changes */
.quantity-enter-active, .quantity-leave-active {
  transition: all 0.3s ease;
}
.quantity-enter-from, .quantity-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>