<template>
  <div>
    <!-- Header with Actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Produtores</h2>
        <p class="text-sm text-gray-600">Gerencie os produtores e fornecedores</p>
      </div>
      <button
        class="bg-aux-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        @click="openCreateModal"
      >
        + Novo Produtor
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nome ou localização..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-aux-orange focus:border-aux-orange"
          @input="debouncedSearch"
        >
      </div>
      <select
        v-model="activeFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-aux-orange focus:border-aux-orange"
        @change="fetchProducers"
      >
        <option value="">Todos os status</option>
        <option value="true">Apenas ativos</option>
        <option value="false">Apenas inativos</option>
      </select>
    </div>

    <!-- Producers Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center">
        <div class="animate-spin w-6 h-6 border-2 border-aux-orange border-t-transparent rounded-full mr-3"/>
        Carregando produtores...
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="producer in producers"
        :key="producer.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ producer.name }}</h3>
              <span
                v-if="producer.isActive"
                class="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
              >
                Ativo
              </span>
              <span
                v-else
                class="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
              >
                Inativo
              </span>
            </div>
            
            <div class="space-y-1 text-sm text-gray-600 mb-4">
              <p v-if="producer.email">
                <span class="font-medium">Email:</span> {{ producer.email }}
              </p>
              <p v-if="producer.phone">
                <span class="font-medium">Telefone:</span> {{ producer.phone }}
              </p>
              <p v-if="producer.location">
                <span class="font-medium">Localização:</span> {{ producer.location }}
              </p>
            </div>

            <div v-if="producer.story" class="mb-4">
              <p class="text-sm text-gray-700 line-clamp-3">{{ producer.story }}</p>
            </div>

            <div class="text-xs text-gray-500">
              <p>{{ producer._count?.products || 0 }} produto(s)</p>
              <p>Criado em {{ formatDate(producer.createdAt) }}</p>
            </div>
          </div>
          
          <div class="flex flex-col space-y-2 ml-4">
            <button
              class="text-aux-orange hover:text-opacity-80 p-1"
              title="Editar produtor"
              @click="openEditModal(producer)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="text-blue-600 hover:text-blue-800 p-1"
              :title="producer.isActive ? 'Desativar produtor' : 'Ativar produtor'"
              @click="toggleProducerStatus(producer)"
            >
              <svg v-if="producer.isActive" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              :disabled="producer._count?.products > 0"
              class="text-red-600 hover:text-red-800 p-1 disabled:text-gray-400 disabled:cursor-not-allowed"
              :title="producer._count?.products > 0 ? 'Não é possível excluir produtor com produtos' : 'Excluir produtor'"
              @click="deleteProducer(producer)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="producers.length === 0 && !loading" class="col-span-full text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum produtor encontrado</h3>
        <p class="text-gray-600 mb-4">
          {{ searchQuery ? 'Tente ajustar os filtros de busca' : 'Comece criando seu primeiro produtor' }}
        </p>
        <button
          v-if="!searchQuery"
          class="bg-aux-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          @click="openCreateModal"
        >
          Criar Primeiro Produtor
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
      <button
        :disabled="currentPage <= 1"
        class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        @click="changePage(currentPage - 1)"
      >
        Anterior
      </button>
      
      <span class="text-sm text-gray-600">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <button
        :disabled="currentPage >= totalPages"
        class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        @click="changePage(currentPage + 1)"
      >
        Próxima
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="modal.show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="modal.show = false"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        <div
          class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          @click.stop
        >
          <form @submit.prevent="saveProducer">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ modal.isEdit ? 'Editar Produtor' : 'Novo Produtor' }}
                  </h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label for="producerName" class="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Produtor *
                      </label>
                      <input
                        id="producerName"
                        v-model="modal.form.name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                        placeholder="Ex: João Silva"
                      >
                    </div>
                    
                    <div>
                      <label for="producerEmail" class="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="producerEmail"
                        v-model="modal.form.email"
                        type="email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                        placeholder="joao@email.com"
                      >
                    </div>

                    <div>
                      <label for="producerPhone" class="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        id="producerPhone"
                        v-model="modal.form.phone"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                        placeholder="(11) 99999-9999"
                      >
                    </div>

                    <div>
                      <label for="producerLocation" class="block text-sm font-medium text-gray-700 mb-1">
                        Localização
                      </label>
                      <input
                        id="producerLocation"
                        v-model="modal.form.location"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                        placeholder="Cidade, Estado"
                      >
                    </div>
                    
                    <div>
                      <label for="producerStory" class="block text-sm font-medium text-gray-700 mb-1">
                        História do Produtor
                      </label>
                      <textarea
                        id="producerStory"
                        v-model="modal.form.story"
                        rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange resize-none"
                        placeholder="Conte a história e os valores do produtor..."
                      />
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
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="modal.show = false"
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
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
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
                  Excluir Produtor
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja excluir o produtor "{{ deleteModal.producer?.name }}"? 
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              :disabled="deleteModal.loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              @click="confirmDelete"
            >
              {{ deleteModal.loading ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deleteModal.show = false"
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
const producers = ref([])
const searchQuery = ref('')
const activeFilter = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 12

const modal = ref({
  show: false,
  isEdit: false,
  loading: false,
  producer: null,
  form: {
    name: '',
    email: '',
    phone: '',
    location: '',
    story: ''
  }
})

const deleteModal = ref({
  show: false,
  producer: null,
  loading: false
})

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchProducers()
  }, 500)
}

// Fetch producers
const fetchProducers = async () => {
  loading.value = true
  try {
    const { $config } = useNuxtApp()
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: limit.toString()
    })
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    if (activeFilter.value) {
      params.append('isActive', activeFilter.value)
    }

    const response = await $fetch(`${$config.public.apiBaseUrl}/api/producers?${params}`)
    producers.value = response.producers
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('Error fetching producers:', error)
  } finally {
    loading.value = false
  }
}

// Pagination
const changePage = (page) => {
  currentPage.value = page
  fetchProducers()
}

// Modal functions
const openCreateModal = () => {
  modal.value = {
    show: true,
    isEdit: false,
    loading: false,
    producer: null,
    form: {
      name: '',
      email: '',
      phone: '',
      location: '',
      story: ''
    }
  }
}

const openEditModal = (producer) => {
  modal.value = {
    show: true,
    isEdit: true,
    loading: false,
    producer,
    form: {
      name: producer.name,
      email: producer.email || '',
      phone: producer.phone || '',
      location: producer.location || '',
      story: producer.story || ''
    }
  }
}

// Save producer
const saveProducer = async () => {
  modal.value.loading = true
  
  try {
    const token = useCookie('admin-token')
    const { $config } = useNuxtApp()
    
    if (modal.value.isEdit) {
      // Update existing producer
      await $fetch(`${$config.public.apiBaseUrl}/api/producers/${modal.value.producer.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: modal.value.form
      })
    } else {
      // Create new producer
      await $fetch(`${$config.public.apiBaseUrl}/api/producers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: modal.value.form
      })
    }
    
    modal.value.show = false
    await fetchProducers()
  } catch (error) {
    console.error('Error saving producer:', error)
    alert('Erro ao salvar produtor')
  } finally {
    modal.value.loading = false
  }
}

// Toggle producer active status
const toggleProducerStatus = async (producer) => {
  try {
    const token = useCookie('admin-token')
    const { $config } = useNuxtApp()
    
    await $fetch(`${$config.public.apiBaseUrl}/api/producers/${producer.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        isActive: !producer.isActive
      }
    })
    
    await fetchProducers()
  } catch (error) {
    console.error('Error toggling producer status:', error)
    alert('Erro ao alterar status do produtor')
  }
}

// Delete producer
const deleteProducer = (producer) => {
  if (producer._count?.products > 0) {
    alert('Não é possível excluir um produtor que possui produtos. Remova ou mova os produtos primeiro.')
    return
  }
  
  deleteModal.value = {
    show: true,
    producer,
    loading: false
  }
}

const confirmDelete = async () => {
  deleteModal.value.loading = true
  
  try {
    const token = useCookie('admin-token')
    const { $config } = useNuxtApp()
    
    await $fetch(`${$config.public.apiBaseUrl}/api/producers/${deleteModal.value.producer.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    deleteModal.value.show = false
    await fetchProducers()
  } catch (error) {
    console.error('Error deleting producer:', error)
    alert('Erro ao excluir produtor')
  } finally {
    deleteModal.value.loading = false
  }
}

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(() => {
  fetchProducers()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>