<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Preços das Cestas</h2>
      <p class="text-sm text-gray-600">Configure os preços e quantidades para cada perfil de família</p>
    </div>

    <!-- Box Prices Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center">
        <div class="animate-spin w-6 h-6 border-2 border-aux-orange border-t-transparent rounded-full mr-3"></div>
        Carregando configurações...
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="boxPrice in boxPrices"
        :key="boxPrice.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ boxPrice.name }}</h3>
            <p class="text-sm text-gray-600">Perfil: {{ boxPrice.profileType }} pessoa{{ boxPrice.profileType > 1 ? 's' : '' }}</p>
          </div>
          <div class="text-2xl">
            {{ getProfileIcon(boxPrice.profileType) }}
          </div>
        </div>

        <form @submit.prevent="updateBoxPrice(boxPrice)" class="space-y-4">
          <div>
            <label :for="`price-${boxPrice.id}`" class="block text-sm font-medium text-gray-700 mb-1">
              Preço Base (R$)
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <input
                :id="`price-${boxPrice.id}`"
                v-model="boxPrice.basePrice"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label :for="`items-${boxPrice.id}`" class="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Itens
            </label>
            <input
              :id="`items-${boxPrice.id}`"
              v-model="boxPrice.itemCount"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="8"
            />
          </div>

          <!-- Price per item calculation -->
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Preço por item:</span>
              <span class="font-medium text-gray-900">
                R$ {{ (boxPrice.basePrice / boxPrice.itemCount || 0).toFixed(2) }}
              </span>
            </div>
            <div class="flex justify-between text-sm mt-1">
              <span class="text-gray-600">Preço por pessoa:</span>
              <span class="font-medium text-gray-900">
                R$ {{ (boxPrice.basePrice / boxPrice.profileType || 0).toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="resetBoxPrice(boxPrice)"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Resetar
            </button>
            <button
              type="submit"
              :disabled="updatingIds.includes(boxPrice.id)"
              class="px-4 py-2 text-sm bg-aux-orange text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ updatingIds.includes(boxPrice.id) ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Pricing Guidelines -->
    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-blue-900 mb-4">💡 Diretrizes de Preços</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
        <div>
          <h4 class="font-medium mb-2">Recomendações:</h4>
          <ul class="space-y-1">
            <li>• Preço por pessoa entre R$ 20-30</li>
            <li>• 6-10 itens por pessoa</li>
            <li>• Margem de 40-60% sobre custo</li>
            <li>• Considere sazonalidade</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium mb-2">Fatores a considerar:</h4>
          <ul class="space-y-1">
            <li>• Custo dos produtos</li>
            <li>• Embalagem e logística</li>
            <li>• Concorrência local</li>
            <li>• Poder aquisitivo do público</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">📊 Estatísticas dos Preços</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-aux-orange">{{ stats.averagePrice }}</div>
          <div class="text-sm text-gray-600">Preço Médio</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ stats.averageItems }}</div>
          <div class="text-sm text-gray-600">Itens Médios</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ stats.averagePricePerItem }}</div>
          <div class="text-sm text-gray-600">R$/Item</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ stats.averagePricePerPerson }}</div>
          <div class="text-sm text-gray-600">R$/Pessoa</div>
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
const boxPrices = ref([])
const updatingIds = ref([])
const originalPrices = ref({})

// Fetch box prices
const fetchBoxPrices = async () => {
  loading.value = true
  try {
    const { $config } = useNuxtApp()
    const token = useCookie('admin-token')
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/admin/box-prices`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    boxPrices.value = response.map(price => ({
      ...price,
      basePrice: parseFloat(price.basePrice),
      itemCount: parseInt(price.itemCount)
    }))
    
    // Store original prices for reset functionality
    originalPrices.value = {}
    response.forEach(price => {
      originalPrices.value[price.id] = {
        basePrice: parseFloat(price.basePrice),
        itemCount: parseInt(price.itemCount)
      }
    })
  } catch (error) {
    console.error('Error fetching box prices:', error)
  } finally {
    loading.value = false
  }
}

// Update box price
const updateBoxPrice = async (boxPrice) => {
  updatingIds.value.push(boxPrice.id)
  
  try {
    const token = useCookie('admin-token')
    
    const { $config } = useNuxtApp()
    await $fetch(`${$config.public.apiBaseUrl}/api/admin/box-prices/${boxPrice.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        basePrice: boxPrice.basePrice,
        itemCount: boxPrice.itemCount
      }
    })
    
    // Update original price after successful save
    originalPrices.value[boxPrice.id] = {
      basePrice: boxPrice.basePrice,
      itemCount: boxPrice.itemCount
    }
    
    // Show success feedback
    showNotification('Preço atualizado com sucesso!', 'success')
  } catch (error) {
    console.error('Error updating box price:', error)
    showNotification('Erro ao atualizar preço', 'error')
  } finally {
    updatingIds.value = updatingIds.value.filter(id => id !== boxPrice.id)
  }
}

// Reset box price to original
const resetBoxPrice = (boxPrice) => {
  const original = originalPrices.value[boxPrice.id]
  if (original) {
    boxPrice.basePrice = original.basePrice
    boxPrice.itemCount = original.itemCount
  }
}

// Get profile icon
const getProfileIcon = (profileType) => {
  const icons = {
    1: '👤',
    2: '👫',
    3: '👨‍👩‍👧',
    5: '👨‍👩‍👧‍👦'
  }
  return icons[profileType] || '👥'
}

// Statistics
const stats = computed(() => {
  if (boxPrices.value.length === 0) {
    return {
      averagePrice: 'R$ 0,00',
      averageItems: '0',
      averagePricePerItem: 'R$ 0,00',
      averagePricePerPerson: 'R$ 0,00'
    }
  }
  
  const avgPrice = boxPrices.value.reduce((sum, box) => sum + box.basePrice, 0) / boxPrices.value.length
  const avgItems = boxPrices.value.reduce((sum, box) => sum + box.itemCount, 0) / boxPrices.value.length
  const avgPricePerItem = boxPrices.value.reduce((sum, box) => sum + (box.basePrice / box.itemCount), 0) / boxPrices.value.length
  const avgPricePerPerson = boxPrices.value.reduce((sum, box) => sum + (box.basePrice / box.profileType), 0) / boxPrices.value.length
  
  return {
    averagePrice: `R$ ${avgPrice.toFixed(2)}`,
    averageItems: Math.round(avgItems).toString(),
    averagePricePerItem: `R$ ${avgPricePerItem.toFixed(2)}`,
    averagePricePerPerson: `R$ ${avgPricePerPerson.toFixed(2)}`
  }
})

// Simple notification system
const showNotification = (message, type = 'info') => {
  // In a real app, you'd use a proper notification system
  if (type === 'success') {
    alert(`✅ ${message}`)
  } else {
    alert(`❌ ${message}`)
  }
}

onMounted(() => {
  fetchBoxPrices()
})
</script>