<template>
  <AppHeader 
    :basket-items="basketItems" 
    @update-quantity="updateBasketQuantity"
    @clear-cart="clearBasket"
  />
  <slot></slot>
  <AppFooter />
</template>

<script setup>
const basketItems = ref([])

// LocalStorage key for basket persistence
const BASKET_STORAGE_KEY = 'feiraja-basket'

// Load basket from localStorage on mount
const loadBasketFromStorage = () => {
  if (process.client) {
    try {
      const savedBasket = localStorage.getItem(BASKET_STORAGE_KEY)
      if (savedBasket) {
        const parsedBasket = JSON.parse(savedBasket)
        basketItems.value = parsedBasket
        console.log('🛒 Basket loaded from localStorage:', parsedBasket.length, 'items')
      }
    } catch (error) {
      console.error('❌ Error loading basket from localStorage:', error)
    }
  }
}

// Save basket to localStorage
const saveBasketToStorage = () => {
  if (process.client) {
    try {
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketItems.value))
      console.log('💾 Basket saved to localStorage:', basketItems.value.length, 'items')
    } catch (error) {
      console.error('❌ Error saving basket to localStorage:', error)
    }
  }
}

// Watch for basket changes and save to localStorage
watch(basketItems, () => {
  saveBasketToStorage()
}, { deep: true })

const updateBasketQuantity = (data) => {
  const { productId, quantity } = data
  
  if (quantity <= 0) {
    // Remove item from basket
    basketItems.value = basketItems.value.filter(item => item.product.id !== productId)
  } else {
    const existingItem = basketItems.value.find(item => item.product.id === productId)
    if (existingItem) {
      existingItem.quantity = quantity
    }
  }
}

// Provide basket functions to child components
provide('addToBasket', (product, quantity) => {
  const existingItem = basketItems.value.find(item => item.product.id === product.id)
  
  if (quantity <= 0) {
    // Remove item from basket if quantity is 0 or less
    basketItems.value = basketItems.value.filter(item => item.product.id !== product.id)
  } else if (existingItem) {
    existingItem.quantity = quantity
  } else {
    basketItems.value.push({
      product,
      quantity
    })
  }
})

provide('getBasketItems', () => basketItems.value)

const clearBasket = () => {
  basketItems.value = []
}

provide('clearBasket', clearBasket)

// Load basket from localStorage when component is mounted
onMounted(() => {
  loadBasketFromStorage()
})
</script>

<style></style>
