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
        <h1 class="text-2xl font-bold text-aux-black">
          {{ isEditing ? 'Editar Endereço' : isNewAddress ? 'Novo Endereço' : 'Endereço de Entrega' }}
        </h1>
        <p class="text-gray-600">
          {{ isEditing ? 'Atualize os dados do endereço' : isNewAddress ? 'Cadastre um novo endereço' : 'Preencha os dados para finalizar seu pedido' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitOrder" class="bg-white rounded-lg shadow-sm p-6">
        <!-- Label (for saved addresses) -->
        <div v-if="isEditing || isNewAddress" class="mb-4">
          <label for="label" class="block text-sm font-medium text-aux-black mb-2">
            Nome do Endereço *
          </label>
          <input
            id="label"
            v-model="form.label"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
            placeholder="Ex: Casa, Trabalho, Casa da Vó..."
          />
        </div>

        <!-- Nome e Sobrenome -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-aux-black mb-2">
              Nome *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Digite seu nome"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-aux-black mb-2">
              Sobrenome *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Digite seu sobrenome"
            />
          </div>
        </div>

        <!-- CEP -->
        <div class="mb-4">
          <label for="zipCode" class="block text-sm font-medium text-aux-black mb-2">
            CEP *
          </label>
          <div class="relative">
            <input
              id="zipCode"
              v-model="form.zipCode"
              type="text"
              required
              maxlength="9"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
              placeholder="00000-000"
              @input="formatZipCode"
              @blur="fetchAddressByZipCode"
            />
            <div v-if="isLoadingAddress" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin w-4 h-4 border-2 border-aux-orange border-t-transparent rounded-full"></div>
            </div>
          </div>
          <p v-if="zipCodeError" class="text-red-500 text-sm mt-1">{{ zipCodeError }}</p>
        </div>

        <!-- Endereço -->
        <div class="mb-4">
          <label for="address" class="block text-sm font-medium text-aux-black mb-2">
            Endereço *
          </label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
            placeholder="Rua, avenida, travessa..."
          />
        </div>

        <!-- Número e Complemento -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="number" class="block text-sm font-medium text-aux-black mb-2">
              Número *
            </label>
            <input
              id="number"
              v-model="form.number"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
              placeholder="123"
            />
          </div>
          <div>
            <label for="complement" class="block text-sm font-medium text-aux-black mb-2">
              Complemento
            </label>
            <input
              id="complement"
              v-model="form.complement"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Apto, bloco, casa..."
            />
          </div>
        </div>

        <!-- Instruções de Entrega -->
        <div class="mb-6">
          <label for="deliveryInstructions" class="block text-sm font-medium text-aux-black mb-2">
            Instruções de Entrega
          </label>
          <textarea
            id="deliveryInstructions"
            v-model="form.deliveryInstructions"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange resize-none"
            placeholder="Instruções especiais para o entregador (ponto de referência, como encontrar, etc.)"
          ></textarea>
        </div>

        <!-- Order Summary -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
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

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-aux-orange text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Processando...</span>
          <span v-else-if="isEditing">Salvar Alterações</span>
          <span v-else-if="isNewAddress">Salvar Endereço</span>
          <span v-else>Confirmar Pedido</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const route = useRoute()

// Get basket items from layout
const basketItems = inject('getBasketItems', () => [])()

const form = ref({
  firstName: '',
  lastName: '',
  zipCode: '',
  address: '',
  number: '',
  complement: '',
  deliveryInstructions: '',
  label: ''
})

const isLoadingAddress = ref(false)
const isSubmitting = ref(false)
const zipCodeError = ref('')
const isEditing = ref(false)
const isNewAddress = ref(false)

// Check if this is edit mode or new address mode
onMounted(() => {
  isEditing.value = !!route.query.edit
  isNewAddress.value = !!route.query.new
  
  if (isEditing.value) {
    // Load address data for editing - in real app, fetch from API
    const addressId = parseInt(route.query.edit)
    loadAddressForEdit(addressId)
  }
})

const loadAddressForEdit = async (addressId) => {
  try {
    const { $config } = useNuxtApp()
    const token = useCookie('admin-token')
    
    const address = await $fetch(`${$config.public.apiBaseUrl}/api/addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    if (address) {
      form.value = {
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        zipCode: address.zipCode || '',
        address: address.street ? `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}` : '',
        number: address.number || '',
        complement: address.complement || '',
        deliveryInstructions: address.deliveryInstructions || '',
        label: address.label || ''
      }
    }
  } catch (error) {
    console.error('Error loading address:', error)
    alert('Erro ao carregar endereço')
    router.push('/manage-address')
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

const formatZipCode = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 5) {
    value = value.replace(/^(\d{5})(\d{0,3})/, '$1-$2')
  }
  form.value.zipCode = value
  zipCodeError.value = ''
}

const fetchAddressByZipCode = async () => {
  const zipCode = form.value.zipCode.replace(/\D/g, '')
  
  if (zipCode.length !== 8) {
    zipCodeError.value = 'CEP deve ter 8 dígitos'
    return
  }

  isLoadingAddress.value = true
  zipCodeError.value = ''

  try {
    const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
    const data = await response.json()

    if (data.erro) {
      zipCodeError.value = 'CEP não encontrado'
    } else {
      form.value.address = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
    }
  } catch (error) {
    zipCodeError.value = 'Erro ao buscar CEP'
  } finally {
    isLoadingAddress.value = false
  }
}

const submitOrder = async () => {
  isSubmitting.value = true
  
  try {
    const { $config } = useNuxtApp()
    const token = useCookie('admin-token')
    
    // Parse address back to separate fields for API
    const addressParts = form.value.address.split(', ')
    const addressData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      zipCode: form.value.zipCode,
      street: addressParts[0] || form.value.address,
      number: form.value.number,
      complement: form.value.complement,
      neighborhood: addressParts[1] || '',
      city: addressParts[2]?.split(' - ')[0] || '',
      state: addressParts[2]?.split(' - ')[1] || '',
      deliveryInstructions: form.value.deliveryInstructions,
      label: form.value.label
    }
    
    if (isEditing.value) {
      // Update existing address
      const addressId = parseInt(route.query.edit)
      await $fetch(`${$config.public.apiBaseUrl}/api/addresses/${addressId}`, {
        method: 'PUT',
        body: addressData,
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      alert('Endereço atualizado com sucesso!')
      router.push('/manage-address')
    } else if (isNewAddress.value) {
      // Save new address
      await $fetch(`${$config.public.apiBaseUrl}/api/addresses`, {
        method: 'POST',
        body: addressData,
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      alert('Endereço salvo com sucesso!')
      router.push('/manage-address')
    } else {
      // Process order with new address
      const orderData = {
        customer: addressData,
        items: basketItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: totalPrice.value,
        deliveryAddress: addressData
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
    }
  } catch (error) {
    console.error('Error submitting:', error)
    
    // Show more specific error messages
    if (error.status === 401) {
      alert('Sessão expirada. Faça login novamente.')
    } else if (error.status === 400) {
      alert('Dados inválidos. Verifique as informações e tente novamente.')
    } else {
      alert('Erro ao processar. Tente novamente.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>