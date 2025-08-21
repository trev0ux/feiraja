<template>
  <div>
    <!-- Product Image -->
    <div class="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative">
      <img
        v-if="product.image"
        :src="`${$config.public.apiBaseUrl}${product.image}`"
        :alt="product.name"
        class="w-full h-full object-cover rounded-lg"
      />
      <span v-else class="text-gray-400 text-sm">Sem imagem</span>

      <div class="flex items-center justify-between absolute right-[8px] bottom-[8px]">
        <!-- Plus icon only (when quantity is 0) -->
        <button
          v-if="quantity === 0"
          @click="addItem"
          class="w-8 h-8 bg-aux-orange text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
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
            @click="removeItem"
            class="w-8 h-8 bg-white border border-aux-orange text-aux-orange rounded-full flex items-center justify-center hover:bg-white transition-colors"
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
            @click="addItem"
            class="w-8 h-8 bg-aux-orange text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
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
      <h3 class="font-semibold text-aux-black text-sm mb-1">{{ product.name }}</h3>
      <p class="font-bold text-aux-orange text-lg">R$ {{ product.price.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
const { $config } = useNuxtApp()

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
