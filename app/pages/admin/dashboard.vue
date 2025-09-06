<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total de Produtos
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                <span v-if="loading">
                  <div class="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                </span>
                <span v-else>{{ stats.totalProducts }}</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Categorias
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                {{ stats.totalCategories }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Produtos Ativos
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                {{ stats.activeProducts }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Tipos de Cesta
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                {{ stats.boxTypes }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div class="space-y-3">
            <NuxtLink
              to="/admin/products/new"
              class="flex items-center p-3 bg-aux-orange text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Novo Produto
            </NuxtLink>
            
            <NuxtLink
              to="/admin/categories"
              class="flex items-center p-3 bg-green-500 text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Gerenciar Categorias
            </NuxtLink>
            
            <NuxtLink
              to="/admin/box-prices"
              class="flex items-center p-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Configurar Preços
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Recent Products -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Produtos Recentes</h3>
          <div class="space-y-3">
            <div
              v-for="product in recentProducts"
              :key="product.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-sm text-gray-500">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-aux-orange">R$ {{ product.price.toFixed(2) }}</p>
                <p class="text-sm text-gray-500">
                  <span
                    :class="product.inStock ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ product.inStock ? 'Em estoque' : 'Fora de estoque' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink
              to="/admin/products"
              class="text-sm text-aux-orange hover:text-opacity-80"
            >
              Ver todos os produtos →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- System Info -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Informações do Sistema</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500">Versão</dt>
          <dd class="text-sm text-gray-900">v1.0.0</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Último Login</dt>
          <dd class="text-sm text-gray-900">{{ lastLogin }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Status do Servidor</dt>
          <dd class="text-sm">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Online
            </span>
          </dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const loading = ref(true)
const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  activeProducts: 0,
  boxTypes: 4
})

const recentProducts = ref([])
const lastLogin = ref('')

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const { $config } = useNuxtApp()
    console.log('Fetching dashboard data from:', $config.public.apiBaseUrl)
    
    // Fetch categories
    try {
      const categoriesResponse = await $fetch(`${$config.public.apiBaseUrl}/api/categories`)
      console.log('Categories response:', categoriesResponse)
      
      let categoriesList = []
      if (Array.isArray(categoriesResponse)) {
        categoriesList = categoriesResponse
      } else if (categoriesResponse && categoriesResponse.categories) {
        categoriesList = categoriesResponse.categories
      } else if (categoriesResponse && categoriesResponse.data) {
        categoriesList = categoriesResponse.data
      }
      
      stats.value.totalCategories = categoriesList.length
    } catch (error) {
      console.error('Error fetching categories for dashboard:', error)
      stats.value.totalCategories = 0
    }

    // Fetch products
    try {
      const productsResponse = await $fetch(`${$config.public.apiBaseUrl}/api/products?limit=100`)
      console.log('Products response:', productsResponse)
      
      let productsList = []
      let totalProducts = 0
      
      if (Array.isArray(productsResponse)) {
        productsList = productsResponse
        totalProducts = productsResponse.length
      } else if (productsResponse && productsResponse.products) {
        productsList = productsResponse.products
        totalProducts = productsResponse.total || productsResponse.products.length
      } else if (productsResponse && productsResponse.data) {
        productsList = productsResponse.data
        totalProducts = productsResponse.data.length
      }
      
      stats.value.totalProducts = totalProducts
      stats.value.activeProducts = productsList.filter(p => p.inStock).length
      
      // Get recent products (last 5)
      recentProducts.value = productsList.slice(0, 5).map(product => ({
        ...product,
        category: product.category || 'Sem categoria',
        price: product.price || 0
      }))
    } catch (error) {
      console.error('Error fetching products for dashboard:', error)
      stats.value.totalProducts = 0
      stats.value.activeProducts = 0
      recentProducts.value = []
    }

    // Fetch box types
    try {
      const boxPricesResponse = await $fetch(`${$config.public.apiBaseUrl}/api/admin/box-prices`, {
        headers: {
          Authorization: `Bearer ${useCookie('admin-token').value}`
        }
      })
      
      let boxPricesList = []
      if (Array.isArray(boxPricesResponse)) {
        boxPricesList = boxPricesResponse
      } else if (boxPricesResponse && boxPricesResponse.data) {
        boxPricesList = boxPricesResponse.data
      }
      
      stats.value.boxTypes = boxPricesList.length || 4
    } catch (error) {
      console.error('Error fetching box types for dashboard:', error)
      stats.value.boxTypes = 4 // Default fallback
    }

    // Set last login time
    lastLogin.value = new Date().toLocaleString('pt-BR')
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Set default values on error
    stats.value = {
      totalProducts: 0,
      totalCategories: 0,
      activeProducts: 0,
      boxTypes: 4
    }
    recentProducts.value = []
    lastLogin.value = new Date().toLocaleString('pt-BR')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>