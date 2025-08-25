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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-aux-orange border-t-transparent mb-4"></div>
      <p class="text-gray-600">Carregando produto...</p>
    </div>

    <!-- Form -->
    <form v-else class="space-y-6" @submit.prevent="saveProduct">
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
            >
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
            >
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
                >
                <span class="ml-2 text-sm text-gray-700">Ativo</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.inStock"
                  type="radio"
                  :value="false"
                  class="h-4 w-4 text-aux-orange border-gray-300 focus:ring-aux-orange"
                >
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
            />
          </div>
        </div>
      </div>

      <!-- Origin Information -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informações de Origem</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="producer" class="block text-sm font-medium text-gray-700 mb-1">
              Produtor
            </label>
            <select
              id="producer"
              v-model="form.origin.producerId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            >
              <option value="">Selecione um produtor</option>
              <option
                v-for="producer in producers"
                :key="producer.id"
                :value="producer.id"
              >
                {{ producer.name }}{{ producer.location ? ` - ${producer.location}` : '' }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              <NuxtLink 
                to="/admin/producers" 
                target="_blank" 
                class="text-aux-orange hover:text-opacity-80"
              >
                Gerenciar produtores
              </NuxtLink>
            </p>
          </div>

          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <input
              id="location"
              v-model="form.origin.location"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: Ibiúna, São Paulo"
            >
            <p v-if="form.origin.producerId && form.origin.location" class="text-xs text-green-600 mt-1">
              ✓ Preenchido automaticamente do produtor selecionado
            </p>
          </div>

          <div>
            <label for="distance" class="block text-sm font-medium text-gray-700 mb-1">
              Distância
            </label>
            <input
              id="distance"
              v-model="form.origin.distance"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: 45 km de São Paulo"
            >
          </div>

          <div>
            <label for="harvestDate" class="block text-sm font-medium text-gray-700 mb-1">
              Data da Colheita
            </label>
            <input
              id="harvestDate"
              v-model="form.origin.harvestDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
            >
          </div>

          <div class="lg:col-span-2">
            <label for="certifications" class="block text-sm font-medium text-gray-700 mb-1">
              Certificações
            </label>
            <input
              id="certifications"
              v-model="certificationsInput"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: Orgânico IBD, Selo SisOrg (separar por vírgula)"
            >
            <div class="flex justify-between items-start mt-1">
              <p class="text-xs text-gray-500">Separe múltiplas certificações por vírgula</p>
              <p v-if="form.origin.producerId && form.origin.certifications.length > 0" class="text-xs text-green-600">
                ✓ Preenchido automaticamente
              </p>
            </div>
          </div>

          <div class="lg:col-span-2">
            <label for="story" class="block text-sm font-medium text-gray-700 mb-1">
              História do Produtor
            </label>
            <textarea
              id="story"
              v-model="form.origin.story"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange resize-none"
              placeholder="Conte a história do produtor, métodos de cultivo, tradições familiares..."
            />
            <p v-if="form.origin.producerId && form.origin.story" class="text-xs text-green-600 mt-1">
              ✓ Preenchido automaticamente do produtor selecionado
            </p>
          </div>
        </div>
      </div>

      <!-- Nutritional Information -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informações Nutricionais</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <label for="portion" class="block text-sm font-medium text-gray-700 mb-1">
              Porção
            </label>
            <input
              id="portion"
              v-model="form.nutritionalInfo.portion"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: 100g"
            >
          </div>

          <div>
            <label for="calories" class="block text-sm font-medium text-gray-700 mb-1">
              Calorias
            </label>
            <input
              id="calories"
              v-model.number="form.nutritionalInfo.calories"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: 18"
            >
          </div>

          <div>
            <label for="carbs" class="block text-sm font-medium text-gray-700 mb-1">
              Carboidratos
            </label>
            <input
              id="carbs"
              v-model="form.nutritionalInfo.carbs"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: 3.9g"
            >
          </div>

          <div>
            <label for="fiber" class="block text-sm font-medium text-gray-700 mb-1">
              Fibras
            </label>
            <input
              id="fiber"
              v-model="form.nutritionalInfo.fiber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: 1.2g"
            >
          </div>

          <div>
            <label for="protein" class="block text-sm font-medium text-gray-700 mb-1">
              Proteína
            </label>
            <input
              id="protein"
              v-model="form.nutritionalInfo.protein"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: 0.9g"
            >
          </div>

          <div class="lg:col-span-3">
            <label for="vitamins" class="block text-sm font-medium text-gray-700 mb-1">
              Vitaminas e Minerais
            </label>
            <input
              id="vitamins"
              v-model="vitaminsInput"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-aux-orange focus:border-aux-orange"
              placeholder="Ex: Vitamina C, Licopeno, Potássio (separar por vírgula)"
            >
            <p class="text-xs text-gray-500 mt-1">Separe múltiplas vitaminas/minerais por vírgula</p>
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
              >
              <button
                type="button"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                @click="removeCurrentImage"
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
              >
              <button
                type="button"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                @click="removeImagePreview"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Upload area -->
            <div
              v-else
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-aux-orange cursor-pointer transition-colors"
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleDrop"
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
              class="hidden"
              @change="handleFileSelect"
            >
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
const productId = computed(() => {
  const id = parseInt(route.params.id)
  return isNaN(id) ? null : id
})

const loading = ref(false)
const saving = ref(false)
const categories = ref([])
const producers = ref([])

const form = ref({
  name: '',
  description: '',
  price: '',
  categoryId: '',
  inStock: true,
  origin: {
    producerId: '',
    producer: '',
    location: '',
    distance: '',
    harvestDate: '',
    certifications: [],
    story: ''
  },
  nutritionalInfo: {
    portion: '',
    calories: null,
    carbs: '',
    fiber: '',
    protein: '',
    vitamins: []
  }
})

const currentImage = ref('')
const imagePreview = ref('')
const selectedFile = ref(null)

// Computed properties for array inputs
const certificationsInput = computed({
  get: () => form.value.origin.certifications.join(', '),
  set: (value) => {
    form.value.origin.certifications = value 
      ? value.split(',').map(item => item.trim()).filter(item => item)
      : []
  }
})

const vitaminsInput = computed({
  get: () => form.value.nutritionalInfo.vitamins.join(', '),
  set: (value) => {
    form.value.nutritionalInfo.vitamins = value 
      ? value.split(',').map(item => item.trim()).filter(item => item)
      : []
  }
})

// Fetch categories
const fetchCategories = async () => {
  try {
    const { $config } = useNuxtApp()
    categories.value = await $fetch(`${$config.public.apiBaseUrl}/api/categories`)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Fetch producers
const fetchProducers = async () => {
  try {
    const { $config } = useNuxtApp()
    const response = await $fetch(`${$config.public.apiBaseUrl}/api/producers?isActive=true&limit=100`)
    producers.value = response.producers || []
  } catch (error) {
    console.error('Error fetching producers:', error)
  }
}

// Fetch product data for editing
const fetchProduct = async () => {
  if (isNewProduct.value) return

  // Validate product ID
  if (!productId.value) {
    console.error('❌ Invalid product ID:', route.params.id)
    alert('ID do produto inválido.')
    router.push('/admin/products')
    return
  }

  loading.value = true
  try {
    console.log('🔍 Fetching product with ID:', productId.value)
    
    const { $config } = useNuxtApp()
    
    // Fetch product by ID directly
    const product = await $fetch(`${$config.public.apiBaseUrl}/api/products/${productId.value}`)
    
    console.log('📦 Fetched product:', product)
    
    if (product) {
      // Populate form with product data
      form.value = {
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        inStock: product.inStock ?? true,
        origin: {
          producerId: product.origin?.producerId || '',
          producer: product.origin?.producer || '',
          location: product.origin?.location || '',
          distance: product.origin?.distance || '',
          harvestDate: product.origin?.harvestDate || '',
          certifications: product.origin?.certifications || [],
          story: product.origin?.story || ''
        },
        nutritionalInfo: {
          portion: product.nutritionalInfo?.portion || '',
          calories: product.nutritionalInfo?.calories || null,
          carbs: product.nutritionalInfo?.carbs || '',
          fiber: product.nutritionalInfo?.fiber || '',
          protein: product.nutritionalInfo?.protein || '',
          vitamins: product.nutritionalInfo?.vitamins || []
        }
      }
      
      // Set current image
      if (product.image) {
        currentImage.value = product.image
      }
      
      console.log('✅ Product form populated successfully')
    } else {
      throw new Error('Product not found')
    }
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    
    if (error.status === 404) {
      alert('Produto não encontrado.')
    } else {
      alert('Erro ao carregar produto. Tente novamente.')
    }
    
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

// Watch for producer selection and autofill related fields
watch(() => form.value.origin.producerId, (newProducerId) => {
  if (newProducerId) {
    const selectedProducer = producers.value.find(p => p.id === parseInt(newProducerId))
    if (selectedProducer) {
      // Autofill location if not already filled
      if (!form.value.origin.location && selectedProducer.location) {
        form.value.origin.location = selectedProducer.location
      }
      
      // Autofill producer name
      form.value.origin.producer = selectedProducer.name
      
      // Autofill story if not already filled
      if (!form.value.origin.story && selectedProducer.story) {
        form.value.origin.story = selectedProducer.story
      }
      
      // Autofill certifications if not already filled
      if (form.value.origin.certifications.length === 0 && selectedProducer.certifications) {
        if (Array.isArray(selectedProducer.certifications)) {
          form.value.origin.certifications = [...selectedProducer.certifications]
        } else if (typeof selectedProducer.certifications === 'string') {
          form.value.origin.certifications = selectedProducer.certifications.split(',').map(cert => cert.trim())
        }
      }
    }
  } else {
    // Clear autofilled fields when no producer is selected
    form.value.origin.producer = ''
  }
})

// Save product
const saveProduct = async () => {
  saving.value = true

  try {
    const token = useCookie('admin-token')
    
    // Check if user is authenticated
    if (!token.value) {
      alert('Você precisa estar logado para realizar esta ação.')
      router.push('/admin/login')
      return
    }
    
    // Validate required fields
    if (!form.value.name?.trim() || !form.value.price || !form.value.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Preço e Categoria)')
      return
    }
    
    // Validate price
    if (isNaN(parseFloat(form.value.price)) || parseFloat(form.value.price) <= 0) {
      alert('Por favor, insira um preço válido.')
      return
    }
    
    console.log('💾 Saving product...', {
      isNew: isNewProduct.value,
      productId: productId.value,
      formData: form.value
    })
    
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('price', form.value.price)
    formData.append('categoryId', form.value.categoryId)
    formData.append('inStock', form.value.inStock)
    
    // Add origin information
    if (form.value.origin.producerId) formData.append('origin.producerId', form.value.origin.producerId)
    if (form.value.origin.producer) formData.append('origin.producer', form.value.origin.producer)
    if (form.value.origin.location) formData.append('origin.location', form.value.origin.location)
    if (form.value.origin.distance) formData.append('origin.distance', form.value.origin.distance)
    if (form.value.origin.harvestDate) formData.append('origin.harvestDate', form.value.origin.harvestDate)
    if (form.value.origin.certifications.length) formData.append('origin.certifications', JSON.stringify(form.value.origin.certifications))
    if (form.value.origin.story) formData.append('origin.story', form.value.origin.story)
    
    // Add nutritional information
    if (form.value.nutritionalInfo.portion) formData.append('nutritionalInfo.portion', form.value.nutritionalInfo.portion)
    if (form.value.nutritionalInfo.calories !== null) formData.append('nutritionalInfo.calories', form.value.nutritionalInfo.calories)
    if (form.value.nutritionalInfo.carbs) formData.append('nutritionalInfo.carbs', form.value.nutritionalInfo.carbs)
    if (form.value.nutritionalInfo.fiber) formData.append('nutritionalInfo.fiber', form.value.nutritionalInfo.fiber)
    if (form.value.nutritionalInfo.protein) formData.append('nutritionalInfo.protein', form.value.nutritionalInfo.protein)
    if (form.value.nutritionalInfo.vitamins.length) formData.append('nutritionalInfo.vitamins', JSON.stringify(form.value.nutritionalInfo.vitamins))
    
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
    console.error('❌ Error saving product:', error)
    
    // Handle different error types
    if (error.status === 401 || error.statusCode === 401) {
      alert('Sessão expirada. Faça login novamente.')
      router.push('/admin/login')
    } else if (error.status === 400 || error.statusCode === 400) {
      const errorMessage = error.data?.message || error.data?.error || 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.'
      alert(errorMessage)
    } else if (error.status === 404 || error.statusCode === 404) {
      alert('Produto não encontrado.')
      router.push('/admin/products')
    } else if (error.status === 500 || error.statusCode === 500) {
      alert('Erro interno do servidor. Tente novamente mais tarde.')
    } else {
      const errorMessage = error.data?.message || error.message || 'Erro ao salvar produto. Tente novamente.'
      alert(errorMessage)
    }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchProducers()
  await fetchProduct()
})
</script>