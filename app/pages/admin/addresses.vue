<template>
  <div>
    <!-- Header with Actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Endereços dos Clientes</h2>
        <p class="text-sm text-gray-600">Gerencie os endereços cadastrados pelos clientes</p>
      </div>
      <button
        class="bg-aux-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        @click="openCreateModal"
      >
        + Novo Endereço
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nome, endereço, cidade..."
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              @input="debouncedSearch"
            >
            <div v-if="searchLoading" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <div class="animate-spin w-4 h-4 border-2 border-aux-orange border-t-transparent rounded-full"/>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <select
            v-model="filters.city"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            @change="fetchAddresses"
          >
            <option value="">Todas as cidades</option>
            <option
              v-for="city in cities"
              :key="city"
              :value="city"
            >
              {{ city }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="filters.state"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            @change="fetchAddresses"
          >
            <option value="">Todos os estados</option>
            <option
              v-for="state in states"
              :key="state"
              :value="state"
            >
              {{ state }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            @click="clearFilters"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Addresses Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="loading">
        <!-- Table Header Skeleton -->
        <div class="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div class="grid grid-cols-6 gap-4">
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
          </div>
        </div>
        
        <!-- Address Rows Skeleton -->
        <div v-for="i in 8" :key="i" class="border-b border-gray-200 px-6 py-4">
          <div class="grid grid-cols-6 gap-4 items-center">
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"/>
              <div class="h-3 bg-gray-100 rounded animate-pulse w-full"/>
            </div>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-4 bg-gray-200 rounded animate-pulse"/>
            <div class="h-6 bg-gray-200 rounded-full animate-pulse w-16"/>
            <div class="flex space-x-2">
              <div class="h-4 bg-gray-200 rounded animate-pulse w-12"/>
              <div class="h-4 bg-gray-200 rounded animate-pulse w-12"/>
            </div>
          </div>
        </div>
        
        <!-- Loading Status -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-center text-sm text-gray-500">
            <div class="animate-spin w-4 h-4 border-2 border-aux-orange border-t-transparent rounded-full mr-2"/>
            Carregando endereços...
          </div>
        </div>
      </div>

      <div v-else-if="addresses.length === 0" class="p-6 text-center text-gray-500">
        Nenhum endereço encontrado
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endereço
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cidade
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
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
            <tr v-for="address in addresses" :key="address.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-aux-orange flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{ getInitials(address.customerName) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ address.customerName }}</div>
                    <div class="text-sm text-gray-500">{{ address.customerEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ address.street }}, {{ address.number }}
                  <span v-if="address.complement"> - {{ address.complement }}</span>
                </div>
                <div class="text-sm text-gray-500">{{ address.neighborhood }}</div>
                <div class="text-sm text-gray-500">CEP: {{ address.zipCode }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ address.city }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ address.state }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    address.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ address.isActive ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    class="text-aux-orange hover:text-opacity-80"
                    @click="editAddress(address)"
                  >
                    Editar
                  </button>
                  <button
                    class="text-red-600 hover:text-red-800"
                    @click="deleteAddress(address)"
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
            Mostrando {{ addresses.length }} de {{ pagination.total }} endereços
          </div>
          <div class="flex space-x-2">
            <button
              v-for="page in paginationPages"
              :key="page"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                page === pagination.currentPage
                  ? 'bg-aux-orange text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              ]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
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
          class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          @click.stop
        >
          <form @submit.prevent="saveAddress">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ modal.isEdit ? 'Editar Endereço' : 'Novo Endereço' }}
                  </h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Customer Info -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Cliente *
                      </label>
                      <input
                        v-model="form.customerName"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Email do Cliente *
                      </label>
                      <input
                        v-model="form.customerEmail"
                        type="email"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                    </div>
                    
                    <!-- Address Info -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        CEP *
                      </label>
                      <input
                        v-model="form.zipCode"
                        type="text"
                        required
                        maxlength="9"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                        @input="formatZipCode"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Rua *
                      </label>
                      <input
                        v-model="form.street"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Número *
                      </label>
                      <input
                        v-model="form.number"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Complemento
                      </label>
                      <input
                        v-model="form.complement"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Bairro *
                      </label>
                      <input
                        v-model="form.neighborhood"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        v-model="form.city"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <select
                        v-model="form.state"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                      >
                        <option value="">Selecione</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                          <input
                            v-model="form.isActive"
                            type="radio"
                            :value="true"
                            class="h-4 w-4 text-aux-orange border-gray-300 focus:ring-aux-orange"
                          >
                          <span class="ml-2 text-sm text-gray-700">Ativo</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="form.isActive"
                            type="radio"
                            :value="false"
                            class="h-4 w-4 text-aux-orange border-gray-300 focus:ring-aux-orange"
                          >
                          <span class="ml-2 text-sm text-gray-700">Inativo</span>
                        </label>
                      </div>
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
                {{ modal.loading ? 'Salvando...' : 'Salvar' }}
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
                  Excluir Endereço
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja excluir o endereço de "{{ deleteModal.address?.customerName }}"? 
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
const searchLoading = ref(false)
const addresses = ref([])
const cities = ref([])
const states = ref([])

const filters = ref({
  search: '',
  city: '',
  state: ''
})

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0,
  limit: 20
})

const modal = ref({
  show: false,
  isEdit: false,
  loading: false
})

const deleteModal = ref({
  show: false,
  address: null,
  loading: false
})

const form = ref({
  customerName: '',
  customerEmail: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  isActive: true
})

// Mock data for demonstration
const mockAddresses = [
  {
    id: 1,
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    zipCode: '01234-567',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    isActive: true
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    customerEmail: 'maria@email.com',
    zipCode: '98765-432',
    street: 'Av. Principal',
    number: '456',
    complement: '',
    neighborhood: 'Jardim América',
    city: 'Rio de Janeiro',
    state: 'RJ',
    isActive: true
  },
  {
    id: 3,
    customerName: 'Pedro Costa',
    customerEmail: 'pedro@email.com',
    zipCode: '11111-222',
    street: 'Rua da Paz',
    number: '789',
    complement: 'Casa',
    neighborhood: 'Vila Nova',
    city: 'Belo Horizonte',
    state: 'MG',
    isActive: false
  }
]

// Fetch addresses with filters and pagination
const fetchAddresses = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let filteredAddresses = [...mockAddresses]
    
    // Apply search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filteredAddresses = filteredAddresses.filter(addr => 
        addr.customerName.toLowerCase().includes(search) ||
        addr.customerEmail.toLowerCase().includes(search) ||
        addr.street.toLowerCase().includes(search) ||
        addr.city.toLowerCase().includes(search) ||
        addr.neighborhood.toLowerCase().includes(search)
      )
    }
    
    // Apply city filter
    if (filters.value.city) {
      filteredAddresses = filteredAddresses.filter(addr => addr.city === filters.value.city)
    }
    
    // Apply state filter
    if (filters.value.state) {
      filteredAddresses = filteredAddresses.filter(addr => addr.state === filters.value.state)
    }

    addresses.value = filteredAddresses
    
    // Update filter options
    cities.value = [...new Set(mockAddresses.map(addr => addr.city))].sort()
    states.value = [...new Set(mockAddresses.map(addr => addr.state))].sort()
    
    pagination.value = {
      currentPage: 1,
      totalPages: 1,
      total: filteredAddresses.length,
      limit: 20
    }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    addresses.value = []
  } finally {
    loading.value = false
  }
}

// Debounced search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchLoading.value = true
  searchTimeout = setTimeout(async () => {
    pagination.value.currentPage = 1
    await fetchAddresses()
    searchLoading.value = false
  }, 500)
}

// Clear filters
const clearFilters = () => {
  clearTimeout(searchTimeout)
  searchLoading.value = false
  filters.value = {
    search: '',
    city: '',
    state: ''
  }
  pagination.value.currentPage = 1
  fetchAddresses()
}

// Pagination
const paginationPages = computed(() => {
  const pages = []
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  
  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + 4)
  
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
  fetchAddresses()
}

// Helper functions
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatZipCode = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.value.zipCode = value
}

// CRUD operations
const openCreateModal = () => {
  form.value = {
    customerName: '',
    customerEmail: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    isActive: true
  }
  modal.value = {
    show: true,
    isEdit: false,
    loading: false
  }
}

const editAddress = (address) => {
  form.value = { ...address }
  modal.value = {
    show: true,
    isEdit: true,
    loading: false
  }
}

const saveAddress = async () => {
  modal.value.loading = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (modal.value.isEdit) {
      // Update existing address
      const index = mockAddresses.findIndex(addr => addr.id === form.value.id)
      if (index !== -1) {
        mockAddresses[index] = { ...form.value }
      }
    } else {
      // Create new address
      const newAddress = {
        ...form.value,
        id: Math.max(...mockAddresses.map(addr => addr.id)) + 1
      }
      mockAddresses.push(newAddress)
    }
    
    modal.value.show = false
    await fetchAddresses()
  } catch (error) {
    console.error('Error saving address:', error)
    alert('Erro ao salvar endereço')
  } finally {
    modal.value.loading = false
  }
}

const deleteAddress = (address) => {
  deleteModal.value = {
    show: true,
    address,
    loading: false
  }
}

const confirmDelete = async () => {
  deleteModal.value.loading = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = mockAddresses.findIndex(addr => addr.id === deleteModal.value.address.id)
    if (index !== -1) {
      mockAddresses.splice(index, 1)
    }
    
    deleteModal.value.show = false
    await fetchAddresses()
  } catch (error) {
    console.error('Error deleting address:', error)
    alert('Erro ao excluir endereço')
  } finally {
    deleteModal.value.loading = false
  }
}

onMounted(async () => {
  await fetchAddresses()
})
</script>