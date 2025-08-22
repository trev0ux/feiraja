<template>
  <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
    <button
      v-for="category in categories"
      :key="category.id"
      :class="[
        'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
        category.active
          ? 'bg-aux-orange text-white'
          : 'bg-white text-aux-orange border border-aux-orange hover:bg-gray-50',
      ]"
      @click="selectCategory(category.id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['categorySelected'])
const { apiCall } = useApi()

const categories = ref([
  { id: 0, name: 'Todas', active: true }
])

// Fetch categories from API
const fetchCategories = async () => {
  try {
    const apiCategories = await apiCall('/api/categories')
    categories.value = [
      { id: 0, name: 'Todas', active: true },
      ...apiCategories.map(cat => ({ ...cat, active: false }))
    ]
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

onMounted(() => {
  fetchCategories()
})

const selectCategory = categoryId => {
  categories.value.forEach(category => {
    category.active = category.id === categoryId
  })

  const selectedCategory = categories.value.find(cat => cat.id === categoryId)
  emit('categorySelected', selectedCategory)
}
</script>
