<template>
  <AppHeader 
    :basket-items="basketItems" 
    @update-quantity="updateBasketQuantity" 
  />
  <slot></slot>
  <AppFooter />
</template>

<script setup>
const basketItems = ref([])

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
  
  if (existingItem) {
    existingItem.quantity = quantity
  } else {
    basketItems.value.push({
      product,
      quantity
    })
  }
})

provide('getBasketItems', () => basketItems.value)
</script>

<style></style>
