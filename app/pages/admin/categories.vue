<template>
  <div>
    <!-- Header with Actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Categorias</h2>
        <p class="text-sm text-gray-600">Gerencie as categorias de produtos</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-aux-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        + Nova Categoria
      </button>
    </div>

    <!-- Categories Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center">
        <div class="animate-spin w-6 h-6 border-2 border-aux-orange border-t-transparent rounded-full mr-3"></div>
        Carregando categorias...
      </div>
    </div>

    <div v-else-if="categories && categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ category.description || 'Sem descrição' }}</p>
            <div class="text-xs text-gray-500">
              <p>{{ productCounts[category.id] || 0 }} produto(s)</p>
              <p>Criado em {{ formatDate(category.createdAt) }}</p>
            </div>
          </div>
          <div class="flex space-x-2 ml-4">
            <button
              @click="openEditModal(category)"
              class="text-aux-orange hover:text-opacity-80 p-1"
              title="Editar categoria"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteCategory(category)"
              :disabled="productCounts[category.id] > 0"
              class="text-red-600 hover:text-red-800 p-1 disabled:text-gray-400 disabled:cursor-not-allowed"
              :title="productCounts[category.id] > 0 ? 'Não é possível excluir categoria com produtos' : 'Excluir categoria'"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
        <p class="text-gray-600 mb-4">Comece criando sua primeira categoria de produtos</p>
        <button
          @click="openCreateModal"
          class="bg-aux-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          Criar Primeira Categoria
        </button>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="modal.show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="modal.show = false"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div
          class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          @click.stop
        >
          <form @submit.prevent="saveCategory">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ modal.isEdit ? 'Editar Categoria' : 'Nova Categoria' }}
                  </h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Categoria *
                      </label>
                      <input
                        id="categoryName"
                        v-model="modal.form.name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                        placeholder="Ex: Frutas"
                      />
                    </div>
                    
                    <div>
                      <label for="categoryDescription" class="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        id="categoryDescription"
                        v-model="modal.form.description"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange resize-none"
                        placeholder="Descreva a categoria..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="modal.loading"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-aux-orange text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ modal.loading ? 'Salvando...' : (modal.isEdit ? 'Salvar' : 'Criar') }}
              </button>
              <button
                type="button"
                @click="modal.show = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
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
                  Excluir Categoria
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja excluir a categoria "{{ deleteModal.category?.name }}"? 
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

const loading = ref(false)
const categories = ref([])
const productCounts = ref({})

const modal = ref({
  show: false,
  isEdit: false,
  loading: false,
  category: null,
  form: {
    name: '',
    description: ''
  }
})

const deleteModal = ref({
  show: false,
  category: null,
  loading: false
})

// Fetch categories
const fetchCategories = async () => {
  loading.value = true
  try {
    const { $config } = useNuxtApp()
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/categories`)
    categories.value = Array.isArray(response) ? response : []
    await fetchProductCounts()
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
    productCounts.value = {}
  } finally {
    loading.value = false
  }
}

// Fetch product counts for each category
const fetchProductCounts = async () => {
  try {
    const { $config } = useNuxtApp()
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/products?page=1&limit=1000`)
    const counts = {}
    
    if (categories.value && Array.isArray(categories.value)) {
      categories.value.forEach(category => {
        // Handle different response formats
        let products = []
        if (response && Array.isArray(response)) {
          products = response
        } else if (response && response.products && Array.isArray(response.products)) {
          products = response.products
        } else if (response && response.data && Array.isArray(response.data)) {
          products = response.data
        }
        
        counts[category.id] = products.filter(p => p.categoryId === category.id).length
      })
    }
    
    productCounts.value = counts
  } catch (error) {
    console.error('Error fetching product counts:', error)
    productCounts.value = {}
  }
}

// Modal functions
const openCreateModal = () => {
  modal.value = {
    show: true,
    isEdit: false,
    loading: false,
    category: null,
    form: {
      name: '',
      description: ''
    }
  }
}

const openEditModal = (category) => {
  modal.value = {
    show: true,
    isEdit: true,
    loading: false,
    category,
    form: {
      name: category.name,
      description: category.description || ''
    }
  }
}

// Save category
const saveCategory = async () => {
  modal.value.loading = true
  
  try {
    const token = useCookie('admin-token')
    
    if (modal.value.isEdit) {
      // Update existing category
      const { $config } = useNuxtApp()
      await $fetch(`${$config.public.apiBaseUrl}/api/admin/categories/${modal.value.category.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: modal.value.form
      })
    } else {
      // Create new category
      const { $config } = useNuxtApp()
      await $fetch(`${$config.public.apiBaseUrl}/api/admin/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: modal.value.form
      })
    }
    
    modal.value.show = false
    await fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    alert('Erro ao salvar categoria')
  } finally {
    modal.value.loading = false
  }
}

// Delete category
const deleteCategory = (category) => {
  if (productCounts.value[category.id] > 0) {
    alert('Não é possível excluir uma categoria que possui produtos. Remova ou mova os produtos primeiro.')
    return
  }
  
  deleteModal.value = {
    show: true,
    category,
    loading: false
  }
}

const confirmDelete = async () => {
  deleteModal.value.loading = true
  
  try {
    const token = useCookie('admin-token')
    
    const { $config } = useNuxtApp()
    await $fetch(`${$config.public.apiBaseUrl}/api/admin/categories/${deleteModal.value.category.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    deleteModal.value.show = false
    await fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Erro ao excluir categoria')
  } finally {
    deleteModal.value.loading = false
  }
}

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(() => {
  fetchCategories()
})
</script>