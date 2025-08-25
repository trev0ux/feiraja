<script setup lang="ts">
import BasketIcon from './icons/BasketIcon.vue'
import LogoIcon from './icons/LogoIcon.vue'
import BasketModal from './BasketModal.vue'

const props = defineProps({
  basketItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['updateQuantity', 'clearCart'])

const isBasketModalOpen = ref(false)

const openBasketModal = () => {
  isBasketModalOpen.value = true
}

const closeBasketModal = () => {
  isBasketModalOpen.value = false
}

const handleUpdateQuantity = (data) => {
  emit('updateQuantity', data)
}

const handleClearCart = () => {
  emit('clearCart')
}

const totalItems = computed(() => {
  return props.basketItems.reduce((total, item) => total + item.quantity, 0)
})
</script>

<template>
  <header class="bg-aux-light-yellow">
    <div class="container py-4 flex justify-between items-center">
      <NuxtLink to="/" class="flex font-grotesque items-center gap-2 text-aux-black text-lg font-black">
        <LogoIcon />
        Feirajá
      </NuxtLink>

      <button
        type="button"
        aria-label="Carrinho"
        class="bg-aux-orange text-white rounded-full gap-2 flex items-center text-sm p-2"
        @click="openBasketModal"
      >
        <BasketIcon />
        {{ totalItems }}
      </button>
    </div>
    
    <!-- Basket Modal -->
    <BasketModal
      :is-open="isBasketModalOpen"
      :basket-items="basketItems"
      @close="closeBasketModal"
      @update-quantity="handleUpdateQuantity"
      @clear-cart="handleClearCart"
    />
  </header>
</template>
