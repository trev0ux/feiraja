<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container py-6">
      <!-- Header -->
      <div class="mb-6">
        <button @click="goBack" class="flex items-center text-aux-orange mb-4 hover:text-opacity-80">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="ml-2">Voltar</span>
        </button>
        <h1 class="text-2xl font-bold text-aux-black">Selecionar Endereço</h1>
        <p class="text-gray-600">Escolha um endereço ou adicione um novo</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4 mb-6">
        <div v-for="i in 2" :key="i" class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <div class="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div class="ml-3 h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </div>
              <div class="ml-7 space-y-2">
                <div class="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                <div class="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                <div class="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
            <div class="flex gap-2">
              <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700">{{ error }}</p>
        </div>
        <button
          @click="fetchAddresses"
          class="mt-3 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
        >
          Tentar novamente
        </button>
      </div>

      <!-- Saved Addresses -->
      <div v-else-if="hasAddresses" class="space-y-4 mb-6">
        <div
          v-for="address in savedAddresses"
          :key="address.id"
          class="bg-white rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md"
          :class="{ 'ring-2 ring-aux-orange border-aux-orange': selectedAddressId === address.id }"
          @click="selectAddress(address.id)"
        >
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <input
                    type="radio"
                    :value="address.id"
                    v-model="selectedAddressId"
                    class="w-4 h-4 text-aux-orange border-gray-300 focus:ring-aux-orange"
                  />
                  <h3 class="ml-3 font-semibold text-aux-black">{{ address.label }}</h3>
                  <span
                    v-if="address.isDefault"
                    class="ml-2 px-2 py-1 text-xs bg-aux-orange text-white rounded-full"
                  >
                    Padrão
                  </span>
                </div>
                <div class="ml-7 text-gray-600 text-sm">
                  <p class="font-medium">{{ address.firstName }} {{ address.lastName }}</p>
                  <p>{{ address.address }}, {{ address.number }}</p>
                  <p v-if="address.complement">{{ address.complement }}</p>
                  <p>CEP: {{ address.zipCode }}</p>
                  <p v-if="address.deliveryInstructions" class="text-gray-500 mt-1">
                    Obs: {{ address.deliveryInstructions }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click.stop="editAddress(address)"
                  class="p-2 text-gray-400 hover:text-aux-orange transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.334 2.00001C11.5091 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.6673 1.44775C12.9149 1.44775 13.1601 1.49653 13.3889 1.59129C13.6177 1.68605 13.8255 1.82494 14.0007 2.00001C14.1757 2.17508 14.3146 2.38289 14.4094 2.61168C14.5042 2.84048 14.5529 3.08569 14.5529 3.33334C14.5529 3.58099 14.5042 3.8262 14.4094 4.055C14.3146 4.28379 14.1757 4.4916 14.0007 4.66668L5.00065 13.6667L1.33398 14.6667L2.33398 11L11.334 2.00001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button
                  @click.stop="deleteAddress(address.id)"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h8.667z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Address Button -->
      <button
        @click="addNewAddress"
        class="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-aux-orange hover:bg-orange-50 transition-colors group"
      >
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-aux-orange group-hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="font-semibold text-aux-black group-hover:text-aux-orange">Adicionar Novo Endereço</h3>
          <p class="text-gray-500 text-sm">Cadastre um novo endereço de entrega</p>
        </div>
      </button>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow-sm p-4 mt-6">
        <h3 class="font-semibold text-aux-black mb-3">Resumo do Pedido</h3>
        <div class="space-y-2">
          <div v-for="item in basketItems" :key="item.product.id" class="flex justify-between text-sm">
            <span>{{ item.product.name }} ({{ item.quantity }}x)</span>
            <span>R$ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t pt-2 font-semibold text-aux-orange">
            <div class="flex justify-between">
              <span>Total:</span>
              <span>R$ {{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <button
        @click="continueToPayment"
        :disabled="!selectedAddressId"
        class="w-full bg-aux-orange text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        Continuar com Endereço Selecionado
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const router = useRouter()

// Get basket items from layout
const basketItems = inject('getBasketItems', () => [])()

const savedAddresses = ref([])
const selectedAddressId = ref(null)
const isLoading = ref(true)
const error = ref('')

// Fetch addresses from API
const fetchAddresses = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const { $config } = useNuxtApp()
    const token = useCookie('admin-token')
    
    const addresses = await $fetch(`${$config.public.apiBaseUrl}/api/addresses`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    savedAddresses.value = addresses.map(addr => ({
      id: addr.id,
      label: addr.label || 'Endereço',
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      zipCode: addr.zipCode || '',
      address: addr.street ? `${addr.street}, ${addr.neighborhood}, ${addr.city} - ${addr.state}` : '',
      number: addr.number || '',
      complement: addr.complement || '',
      deliveryInstructions: addr.deliveryInstructions || '',
      isDefault: addr.isDefault || false
    }))
    
    // Set default selected address
    const defaultAddr = savedAddresses.value.find(addr => addr.isDefault)
    selectedAddressId.value = defaultAddr?.id || savedAddresses.value[0]?.id || null
    
  } catch (err) {
    console.error('Error fetching addresses:', err)
    error.value = 'Erro ao carregar endereços'
    savedAddresses.value = []
  } finally {
    isLoading.value = false
  }
}

const totalPrice = computed(() => {
  return basketItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
})

const goBack = () => {
  router.back()
}

const selectAddress = (addressId) => {
  selectedAddressId.value = addressId
}

const addNewAddress = () => {
  router.push('/address?new=true')
}

const editAddress = (address) => {
  // Store address data and navigate to edit
  router.push(`/address?edit=${address.id}`)
}

const deleteAddress = async (addressId) => {
  if (confirm('Tem certeza que deseja excluir este endereço?')) {
    try {
      const { $config } = useNuxtApp()
      const token = useCookie('admin-token')
      
      await $fetch(`${$config.public.apiBaseUrl}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      // Refresh addresses list
      await fetchAddresses()
      
    } catch (err) {
      console.error('Error deleting address:', err)
      alert('Erro ao excluir endereço. Tente novamente.')
    }
  }
}

const continueToPayment = async () => {
  if (!selectedAddressId.value) return
  
  const selectedAddress = savedAddresses.value.find(addr => addr.id === selectedAddressId.value)
  
  try {
    const { $config } = useNuxtApp()
    const token = useCookie('admin-token')
    
    // Parse address back to separate fields for order API
    const addressParts = selectedAddress.address.split(', ')
    const orderData = {
      deliveryAddressId: selectedAddress.id,
      items: basketItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: totalPrice.value,
      deliveryAddress: {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        zipCode: selectedAddress.zipCode,
        street: addressParts[0] || '',
        neighborhood: addressParts[1] || '',
        city: addressParts[2]?.split(' - ')[0] || '',
        state: addressParts[2]?.split(' - ')[1] || '',
        number: selectedAddress.number,
        complement: selectedAddress.complement,
        deliveryInstructions: selectedAddress.deliveryInstructions
      }
    }
    
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/orders`, {
      method: 'POST',
      body: orderData,
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Clear basket after successful order
    const clearBasket = inject('clearBasket')
    clearBasket()
    
    alert(`Pedido #${response.orderId || response.id} realizado com sucesso!`)
    router.push('/order-confirmation')
    
  } catch (err) {
    console.error('Error creating order:', err)
    
    if (err.status === 401) {
      alert('Sessão expirada. Faça login novamente.')
    } else if (err.status === 400) {
      alert('Dados inválidos. Verifique as informações e tente novamente.')
    } else {
      alert('Erro ao processar pedido. Tente novamente.')
    }
  }
}

// Check if user has saved addresses
const hasAddresses = computed(() => savedAddresses.value.length > 0)

// Fetch addresses on mount
onMounted(async () => {
  await fetchAddresses()
  
  // If no addresses after loading, redirect to address form
  if (!hasAddresses.value && !isLoading.value) {
    router.replace('/address')
  }
})
</script>