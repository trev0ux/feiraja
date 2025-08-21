<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isNewProduct ? 'Novo Produto' : 'Editar Produto' }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ isNewProduct ? 'Adicione um novo produto ao catálogo' : 'Edite as informações do produto' }}
          </p>
        </div>
        <NuxtLink
          to="/admin/products"
          class="text-gray-600 hover:text-gray-800"
        >
          ← Voltar para produtos
        </NuxtLink>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveProduct" class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="lg:col-span-2">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
          </div>

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: Tomate Orgânico"
            />
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$) *
            </label>
            <input
              id="price"
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="0.00"
            />
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              id="category"
              v-model="form.categoryId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            >
              <option value="">Selecione uma categoria</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="form.inStock"
                  type="radio"
                  :value="true"
                  class="h-4 w-4 text-aux-orange border-gray-300 focus:ring-aux-orange"
                />
                <span class="ml-2 text-sm text-gray-700">Ativo</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.inStock"
                  type="radio"
                  :value="false"
                  class="h-4 w-4 text-aux-orange border-gray-300 focus:ring-aux-orange"
                />
                <span class="ml-2 text-sm text-gray-700">Inativo</span>
              </label>
            </div>
          </div>

          <div class="lg:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange resize-none"
              placeholder="Descreva o produto..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Image Upload -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Imagem do Produto</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Current Image -->
          <div v-if="currentImage" class="space-y-4">
            <p class="text-sm font-medium text-gray-700">Imagem Atual</p>
            <div class="relative">
              <img
                :src="currentImage"
                alt="Imagem atual do produto"
                class="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                @click="removeCurrentImage"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Upload New Image -->
          <div class="space-y-4">
            <p class="text-sm font-medium text-gray-700">
              {{ currentImage ? 'Substituir Imagem' : 'Adicionar Imagem' }}
            </p>
            
            <!-- Preview new image -->
            <div v-if="imagePreview" class="relative">
              <img
                :src="imagePreview"
                alt="Preview da nova imagem"
                class="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                @click="removeImagePreview"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Upload area -->
            <div
              v-else
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleDrop"
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-aux-orange cursor-pointer transition-colors"
            >
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4">
                <p class="text-sm text-gray-600">
                  <span class="font-medium text-aux-orange">Clique para enviar</span>
                  ou arraste e solte
                </p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF até 5MB</p>
              </div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <NuxtLink
          to="/admin/products"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 bg-aux-orange text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ saving ? 'Salvando...' : (isNewProduct ? 'Criar Produto' : 'Salvar Alterações') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()

const isNewProduct = computed(() => route.params.id === 'new')
const productId = computed(() => parseInt(route.params.id))

const loading = ref(false)
const saving = ref(false)
const categories = ref([])

const form = ref({
  name: '',
  description: '',
  price: '',
  categoryId: '',
  inStock: true
})

const currentImage = ref('')
const imagePreview = ref('')
const selectedFile = ref(null)

// Fetch categories
const fetchCategories = async () => {
  try {
    const { $config } = useNuxtApp()
    categories.value = await $fetch(`${$config.public.apiBaseUrl}/api/categories`)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Fetch product data for editing
const fetchProduct = async () => {
  if (isNewProduct.value) return

  loading.value = true
  try {
    const { $config } = useNuxtApp()
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/products?page=1&limit=100`)
    const product = response.products.find(p => p.id === productId.value)
    
    if (product) {
      form.value = {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        inStock: product.inStock
      }
      
      if (product.image) {
        const { $config } = useNuxtApp()
        currentImage.value = `${$config.public.apiBaseUrl}${product.image}`
      }
    } else {
      throw new Error('Product not found')
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    alert('Produto não encontrado')
    router.push('/admin/products')
  } finally {
    loading.value = false
  }
}

// Image handling
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleDrop = (event) => {
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      selectedFile.value = file
      
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}

const removeImagePreview = () => {
  imagePreview.value = ''
  selectedFile.value = null
  if ($refs.fileInput) {
    $refs.fileInput.value = ''
  }
}

const removeCurrentImage = () => {
  currentImage.value = ''
  // Note: In a real app, you might want to flag this for deletion on save
}

// Save product
const saveProduct = async () => {
  saving.value = true

  try {
    const token = useCookie('admin-token')
    
    // Validate required fields
    if (!form.value.name || !form.value.price || !form.value.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Preço e Categoria)')
      return
    }
    
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('price', form.value.price)
    formData.append('categoryId', form.value.categoryId)
    formData.append('inStock', form.value.inStock)
    
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    const { $config } = useNuxtApp()
    const url = isNewProduct.value
      ? `${$config.public.apiBaseUrl}/api/admin/products`
      : `${$config.public.apiBaseUrl}/api/admin/products/${productId.value}`
    
    const method = isNewProduct.value ? 'POST' : 'PUT'

    console.log('Saving product:', { url, method, formData: Object.fromEntries(formData) })

    const response = await $fetch(url, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    console.log('Product saved successfully:', response)
    router.push('/admin/products')
  } catch (error) {
    console.error('Error saving product:', error)
    
    if (error.status === 401) {
      alert('Sessão expirada. Faça login novamente.')
      router.push('/admin/login')
    } else if (error.status === 400) {
      alert('Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.')
    } else {
      alert('Erro ao salvar produto. Tente novamente.')
    }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchProduct()
})
</script>