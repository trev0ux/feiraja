<template>
  <div>
    <!-- Header with Actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Produtos</h2>
        <p class="text-sm text-gray-600">Gerencie todos os produtos da loja</p>
      </div>
      <NuxtLink
        to="/admin/products/new"
        class="bg-aux-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        + Novo Produto
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome do produto..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            v-model="filters.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            @change="fetchProducts"
          >
            <option value="">Todas as categorias</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            @change="fetchProducts"
          >
            <option value="">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-6 text-center">
        <div class="inline-flex items-center">
          <div class="animate-spin w-6 h-6 border-2 border-aux-orange border-t-transparent rounded-full mr-3"></div>
          Carregando produtos...
        </div>
      </div>

      <div v-else-if="products.length === 0" class="p-6 text-center text-gray-500">
        Nenhum produto encontrado
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <img
                      v-if="product.image"
                      :src="`${$config.public.apiBaseUrl}${product.image}`"
                      :alt="product.name"
                      class="h-12 w-12 rounded-lg object-cover"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center"
                    >
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                R$ {{ product.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    product.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.inStock ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <NuxtLink
                    :to="`/admin/products/${product.id}`"
                    class="text-aux-orange hover:text-opacity-80"
                  >
                    Editar
                  </NuxtLink>
                  <button
                    @click="deleteProduct(product)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ products.length }} de {{ pagination.total }} produtos
          </div>
          <div class="flex space-x-2">
            <button
              v-for="page in paginationPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                page === pagination.currentPage
                  ? 'bg-aux-orange text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deleteModal.show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="deleteModal.show = false"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div
          class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          @click.stop
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L5.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Excluir Produto
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja excluir o produto "{{ deleteModal.product?.name }}"? 
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmDelete"
              :disabled="deleteModal.loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ deleteModal.loading ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button
              @click="deleteModal.show = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { $config } = useNuxtApp()
const loading = ref(false)
const products = ref([])
const categories = ref([])

const filters = ref({
  search: '',
  category: '',
  status: ''
})

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0,
  limit: 20
})

const deleteModal = ref({
  show: false,
  product: null,
  loading: false
})

// Fetch products with filters and pagination
const fetchProducts = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: pagination.value.currentPage,
      limit: pagination.value.limit
    })

    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.category) params.append('category', filters.value.category)

    const { $config } = useNuxtApp()
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/products?${params}`)
    
    let filteredProducts = response.products
    
    // Apply status filter on frontend (since backend doesn't have this filter)
    if (filters.value.status === 'active') {
      filteredProducts = filteredProducts.filter(p => p.inStock)
    } else if (filters.value.status === 'inactive') {
      filteredProducts = filteredProducts.filter(p => !p.inStock)
    }

    products.value = filteredProducts
    pagination.value = {
      currentPage: response.page,
      totalPages: response.totalPages,
      total: response.total,
      limit: response.limit
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const { $config } = useNuxtApp()
    categories.value = await $fetch(`${$config.public.apiBaseUrl}/api/categories`)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Debounced search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.currentPage = 1
    fetchProducts()
  }, 500)
}

// Clear filters
const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    status: ''
  }
  pagination.value.currentPage = 1
  fetchProducts()
}

// Pagination
const paginationPages = computed(() => {
  const pages = []
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  
  // Show max 5 pages
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const changePage = (page) => {
  pagination.value.currentPage = page
  fetchProducts()
}

// Delete product
const deleteProduct = (product) => {
  deleteModal.value = {
    show: true,
    product,
    loading: false
  }
}

const confirmDelete = async () => {
  deleteModal.value.loading = true
  
  try {
    const token = useCookie('admin-token')
    
    const { $config } = useNuxtApp()
    await $fetch(`${$config.public.apiBaseUrl}/api/admin/products/${deleteModal.value.product.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    deleteModal.value.show = false
    await fetchProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Erro ao excluir produto')
  } finally {
    deleteModal.value.loading = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})
</script>