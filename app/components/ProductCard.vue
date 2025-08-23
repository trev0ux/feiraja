<template>
  <div>
    <!-- Product Image (Clickable) -->
    <div class="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative">
      <NuxtLink :to="`/product/${product.id}`" class="absolute inset-0 z-0 hover:shadow-md transition-shadow rounded-lg">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover rounded-lg"
        >
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm rounded-lg">
          Sem imagem
        </div>
      </NuxtLink>
      
      <!-- View Details Icon -->
      <div class="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>

      <!-- Quantity Controls (positioned above the link) -->
      <div class="flex items-center justify-between absolute right-[8px] bottom-[8px] z-20">
        <!-- Plus icon only (when quantity is 0) -->
        <button
          v-if="quantity === 0"
          class="w-8 h-8 bg-aux-orange text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
          @click.stop="addItem"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- Quantity controls (when quantity > 0) -->
        <div v-else class="flex items-center gap-3">
          <button
            class="w-8 h-8 bg-white border border-aux-orange text-aux-orange rounded-full flex items-center justify-center hover:bg-white transition-colors"
            @click.stop="removeItem"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <span class="font-semibold text-aux-black min-w-[20px] text-center">{{ quantity }}</span>

          <button
            class="w-8 h-8 bg-aux-orange text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
            @click.stop="addItem"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="mb-3">
      <NuxtLink :to="`/product/${product.id}`" class="block">
        <h3 class="font-semibold text-aux-black text-sm mb-1 hover:text-aux-orange transition-colors">{{ product.name }}</h3>
      </NuxtLink>
      <p class="font-bold text-aux-orange text-lg">R$ {{ product.price.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['quantityChanged'])

const quantity = ref(0)
const addToBasket = inject('addToBasket')

const addItem = () => {
  quantity.value++
  addToBasket(props.product, quantity.value)
  emit('quantityChanged', {
    product: props.product,
    quantity: quantity.value,
    action: 'add',
  })
}

const removeItem = () => {
  if (quantity.value > 0) {
    quantity.value--
    addToBasket(props.product, quantity.value)
    emit('quantityChanged', {
      product: props.product,
      quantity: quantity.value,
      action: 'remove',
    })
  }
}
</script>
