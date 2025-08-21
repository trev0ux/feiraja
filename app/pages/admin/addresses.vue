<template>
  <div>
    <!-- Header with Actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Endereços</h2>
        <p class="text-sm text-gray-600">Gerencie todos os endereços de entrega</p>
      </div>
    </div>

    <!-- Addresses List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="loading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-aux-orange"></div>
          <p class="mt-2 text-sm text-gray-500">Carregando endereços...</p>
        </div>
        
        <div v-else-if="addresses.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum endereço encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Comece adicionando um novo endereço.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <h3 class="text-lg font-medium text-gray-900">{{ address.name }}</h3>
                  <span
                    v-if="address.isDefault"
                    class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-aux-orange text-white"
                  >
                    Padrão
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  {{ address.street }}, {{ address.neighborhood }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ address.city }}, {{ address.state }} - {{ address.zipCode }}
                </p>
                <p v-if="address.complement" class="text-sm text-gray-500">
                  {{ address.complement }}
                </p>
                <p v-if="address.reference" class="text-sm text-gray-500">
                  Referência: {{ address.reference }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="!address.isDefault"
                  @click="setAsDefault(address.id)"
                  class="text-sm text-aux-orange hover:text-aux-orange/80"
                >
                  Definir como padrão
                </button>
              </div>
            </div>
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
const addresses = ref([])

// Fetch addresses
const fetchAddresses = async () => {
  loading.value = true
  try {
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/addresses`)
    addresses.value = response
  } catch (error) {
    console.error('Error fetching addresses:', error)
  } finally {
    loading.value = false
  }
}

// Set address as default
const setAsDefault = async (addressId) => {
  try {
    const token = useCookie('admin-token')
    await $fetch(`${$config.public.apiBaseUrl}/api/admin/addresses/${addressId}/default`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    // Refresh the list
    await fetchAddresses()
  } catch (error) {
    console.error('Error setting default address:', error)
    alert('Erro ao definir endereço padrão')
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>