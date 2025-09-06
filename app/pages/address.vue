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

        <!-- Número do WhatsApp -->
        <div class="mb-4">
          <label for="phoneNumber" class="block text-sm font-medium text-aux-black mb-2">
            Número do WhatsApp *
          </label>
          <input
            id="phoneNumber"
            v-model="form.phoneNumber"
            type="tel"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
            placeholder="(11) 99999-9999"
            @input="formatPhoneNumber"
          />
          <p class="text-sm text-gray-500 mt-1">
            Você receberá um código de verificação via WhatsApp
          </p>
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
          <span v-if="isSubmitting">{{ isSubmitting ? 'Enviando código...' : 'Processando...' }}</span>
          <span v-else-if="isEditing">Salvar Alterações</span>
          <span v-else-if="isNewAddress">Salvar Endereço</span>
          <span v-else>Confirmar Pedido</span>
        </button>
      </form>

      <!-- WhatsApp Verification Modal -->
      <div v-if="showPhoneVerification" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
          <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
              Código Enviado!
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Enviamos um código de 6 dígitos para seu WhatsApp
              <span class="font-medium">{{ form.phoneNumber }}</span>
            </p>
          </div>

          <div class="mb-4">
            <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-2">
              Digite o código
            </label>
            <input
              id="verificationCode"
              v-model="verificationCode"
              type="text"
              placeholder="123456"
              maxlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-aux-orange focus:border-aux-orange"
              @input="verificationCode = verificationCode.replace(/\D/g, '').slice(0, 6)"
            />
          </div>

          <!-- Error Message -->
          <div v-if="verificationError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ verificationError }}</p>
          </div>

          <div class="flex gap-3">
            <button
              @click="showPhoneVerification = false"
              class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Voltar
            </button>
            <button
              @click="verifyCodeAndCompleteOrder"
              :disabled="isVerifyingCode || verificationCode.length !== 6"
              class="flex-2 bg-aux-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isVerifyingCode">Verificando...</span>
              <span v-else>Finalizar Pedido</span>
            </button>
          </div>
        </div>
      </div>
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
  phoneNumber: '',
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

// WhatsApp authentication state
const showPhoneVerification = ref(false)
const verificationCode = ref('')
const isVerifyingCode = ref(false)
const verificationError = ref('')
const { apiCall } = useApi()

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

const formatPhoneNumber = () => {
  let value = form.value.phoneNumber.replace(/\D/g, '')
  
  if (value.length > 11) {
    value = value.slice(0, 11)
  }
  
  if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2')
  } else if (value.length > 0) {
    value = value.replace(/(\d{0,2})/, '($1')
  }
  
  form.value.phoneNumber = value
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
  if (!form.value.phoneNumber.trim()) {
    alert('Por favor, informe seu número de WhatsApp')
    return
  }

  isSubmitting.value = true
  verificationError.value = ''
  
  try {
    // First, send WhatsApp verification code
    const cleanedPhone = form.value.phoneNumber.replace(/\D/g, '')
    
    // Validate phone number
    if (cleanedPhone.length !== 11) {
      alert('Por favor, informe um número de WhatsApp válido')
      return
    }

    // Send verification code
    await apiCall('/api/whatsapp/send-code', {
      method: 'POST',
      body: { phoneNumber: cleanedPhone }
    })
    
    // Show verification step
    showPhoneVerification.value = true
    
  } catch (error) {
    console.error('Error sending verification code:', error)
    verificationError.value = 'Erro ao enviar código. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}

const verifyCodeAndCompleteOrder = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    verificationError.value = 'Por favor, digite o código de 6 dígitos'
    return
  }

  isVerifyingCode.value = true
  verificationError.value = ''

  try {
    const cleanedPhone = form.value.phoneNumber.replace(/\D/g, '')
    
    // Verify the code
    const verifyResponse = await apiCall('/api/whatsapp/verify-code', {
      method: 'POST',
      body: { 
        phoneNumber: cleanedPhone,
        code: verificationCode.value 
      }
    })

    if (verifyResponse.success) {
      // Now process the order with verified phone number
      await processVerifiedOrder(verifyResponse)
    }
  } catch (error) {
    console.error('Code verification error:', error)
    verificationError.value = error.data?.error || 'Código inválido ou expirado'
  } finally {
    isVerifyingCode.value = false
  }
}

const processVerifiedOrder = async (verificationResponse) => {
  try {
    const { $config } = useNuxtApp()
    
    // Parse address back to separate fields for API
    const addressParts = form.value.address.split(', ')
    const addressData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNumber: verificationResponse.phoneNumber,
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
      // Update existing address logic
      const addressId = parseInt(route.query.edit)
      await $fetch(`${$config.public.apiBaseUrl}/api/addresses/${addressId}`, {
        method: 'PUT',
        body: addressData
      })
      
      alert('Endereço atualizado com sucesso!')
      router.push('/manage-address')
    } else if (isNewAddress.value) {
      // Save new address logic
      await $fetch(`${$config.public.apiBaseUrl}/api/addresses`, {
        method: 'POST',
        body: addressData
      })
      
      alert('Endereço salvo com sucesso!')
      router.push('/manage-address')
    } else {
      // Process order with verified phone number
      const orderData = {
        customer: addressData,
        items: basketItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: totalPrice.value,
        deliveryAddress: addressData,
        phoneNumber: verificationResponse.phoneNumber
      }
      
      const response = await $fetch(`${$config.public.apiBaseUrl}/api/orders`, {
        method: 'POST',
        body: orderData
      })
      
      // Clear basket after successful order
      const clearBasket = inject('clearBasket')
      clearBasket()
      
      alert(`Pedido #${response.orderId || response.id} realizado com sucesso!`)
      router.push('/order-confirmation')
    }
  } catch (error) {
    console.error('Error processing order:', error)
    verificationError.value = 'Erro ao processar pedido. Tente novamente.'
  }
}
</script>