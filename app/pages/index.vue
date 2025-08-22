<template>
  <article>
    <div class="bg-aux-light-yellow">
      <section class="py-4 container">
        <h2 class="text-aux-black font-bold text-[32px]">Bom dia,</h2>
        <p class="font-light text-aux-black text-base">Alimentos direto da roça para você</p>
        <div class="flex items-center relative mt-6 lg:max-w-[320px]">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Pesquisar por nome"
            class="border border-aux-grey rounded-lg bg-white px-4 py-2 w-full"
            @input="onSearch"
          />
          <SearchIcon class="absolute right-[15px]" />
        </div>
      </section>
      <section class="border-t border-aux-grey border-b pt-4">
        <div class="container">
          <CategoriesSlider @category-selected="onCategorySelected" />
        </div>
      </section>
    </div>
    <!-- Products Section -->
    <section class="py-6">
      <div class="container">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-aux-black font-semibold text-lg">
              {{ searchTerm ? `Resultados para "${searchTerm}"` : selectedCategory }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ displayedProducts.length }}{{ hasMoreProducts ? '+' : '' }} de {{ allFilteredProducts.length }} produto{{ allFilteredProducts.length !== 1 ? 's' : '' }}
              <span v-if="searchTerm && selectedCategory !== 'Todas'" class="text-aux-orange">
                em {{ selectedCategory }}
              </span>
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
        <!-- Empty State -->
        <div v-if="allFilteredProducts.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <SearchIcon color="#9CA3AF" />
          </div>
          <h3 class="text-gray-900 font-semibold mb-2">Nenhum produto encontrado</h3>
          <p class="text-gray-600 mb-4">
            {{ searchTerm ? `Não encontramos produtos com "${searchTerm}"` : `Não há produtos na categoria "${selectedCategory}"` }}
          </p>
          <div class="space-x-4">
            <button 
              v-if="searchTerm" 
              @click="clearSearch"
              class="text-aux-orange hover:text-opacity-80"
            >
              Limpar busca
            </button>
            <button 
              v-if="selectedCategory !== 'Todas'" 
              @click="selectedCategory = 'Todas'"
              class="text-aux-orange hover:text-opacity-80"
            >
              Ver todos os produtos
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProductCard
              v-for="product in displayedProducts"
              :key="product.id"
              :product="product"
              @quantity-changed="onQuantityChanged"
            />
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="flex items-center space-x-2 text-aux-orange">
              <div class="animate-spin w-6 h-6 border-2 border-aux-orange border-t-transparent rounded-full"></div>
              <span class="text-sm">Carregando mais produtos...</span>
            </div>
          </div>

          <!-- Load More Button (fallback for manual loading) -->
          <div v-else-if="hasMoreProducts" class="flex justify-center py-8">
            <button
              @click="loadMoreProducts"
              class="bg-aux-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Carregar Mais Produtos
            </button>
          </div>

          <!-- End of Results -->
          <div v-else-if="displayedProducts.length > 8" class="text-center py-8">
            <p class="text-gray-500 text-sm">
              🎉 Você viu todos os {{ allFilteredProducts.length }} produtos!
            </p>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<script lang="ts" setup>
import SearchIcon from '~/components/icons/SearchIcon.vue'
import CategoriesSlider from '~/components/CategoriesSlider.vue'
import ProductCard from '~/components/ProductCard.vue'

const { apiCall } = useApi()
const selectedCategory = ref('Todas')
const searchTerm = ref('')
const displayedProductsCount = ref(8) // Start with 8 products
const isLoading = ref(false)
const hasMoreProducts = ref(true)

const onCategorySelected = category => {
  selectedCategory.value = category.name
  // Reset displayed count when category changes
  displayedProductsCount.value = 8
  hasMoreProducts.value = true
  fetchProducts()
}

const onSearch = () => {
  // Reset displayed count when searching
  displayedProductsCount.value = 8
  hasMoreProducts.value = true
  fetchProducts()
}

const clearSearch = () => {
  searchTerm.value = ''
  displayedProductsCount.value = 8
  hasMoreProducts.value = true
  fetchProducts()
}

const allProducts = ref([])
const loading = ref(false)

const allFilteredProducts = computed(() => {
  let products = allProducts.value

  // Filter by category
  if (selectedCategory.value !== 'Todas') {
    products = products.filter(product => product.category === selectedCategory.value)
  }

  // Filter by search term
  if (searchTerm.value.trim()) {
    const search = searchTerm.value.toLowerCase().trim()
    products = products.filter(product => 
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    )
  }

  return products
})

const displayedProducts = computed(() => {
  return allFilteredProducts.value.slice(0, displayedProductsCount.value)
})

// Watch for changes in filtered products to update hasMoreProducts
watch(allFilteredProducts, (newProducts) => {
  hasMoreProducts.value = displayedProductsCount.value < newProducts.length
}, { immediate: true })

// Fetch products from API
const fetchProducts = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: 1,
      limit: 100 // Get more products for infinite scroll
    })

    if (selectedCategory.value !== 'Todas') {
      params.append('category', selectedCategory.value)
    }

    if (searchTerm.value.trim()) {
      params.append('search', searchTerm.value)
    }

    const response = await apiCall(`/api/products?${params}`)
    allProducts.value = response.products
  } catch (error) {
    console.error('Error fetching products:', error)
    allProducts.value = []
  } finally {
    loading.value = false
  }
}

const loadMoreProducts = async () => {
  if (isLoading.value || !hasMoreProducts.value) return
  
  isLoading.value = true
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newCount = displayedProductsCount.value + 8
  displayedProductsCount.value = Math.min(newCount, allFilteredProducts.value.length)
  hasMoreProducts.value = displayedProductsCount.value < allFilteredProducts.value.length
  
  isLoading.value = false
}

const onQuantityChanged = data => {
  console.log('Product quantity changed:', data)
}

// Infinite scroll detection
const handleScroll = () => {
  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // Load more when user is 200px from bottom
  if (scrollPosition >= documentHeight - 200 && !isLoading.value && hasMoreProducts.value) {
    loadMoreProducts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchProducts()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style></style>
