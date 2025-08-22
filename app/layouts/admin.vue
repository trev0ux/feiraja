<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile menu overlay -->
    <div
      v-show="mobileMenuOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </div>

    <!-- Mobile sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-4 bg-aux-orange">
        <div class="flex items-center">
          <LogoIcon :width="40" :height="44" />
          <span class="ml-2 text-xl font-bold text-white">Admin</span>
        </div>
        <button
          @click="mobileMenuOpen = false"
          class="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <nav class="mt-8 flex-1">
        <div class="px-4 space-y-2">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            @click="mobileMenuOpen = false"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
              isActiveRoute(item.path)
                ? 'bg-aux-orange text-white'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <!-- Dashboard Icon -->
            <svg
              v-if="item.path === '/admin/dashboard'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
              />
            </svg>
            <!-- Products Icon -->
            <svg
              v-else-if="item.path === '/admin/products'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <!-- Categories Icon -->
            <svg
              v-else-if="item.path === '/admin/categories'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <!-- Box Prices Icon -->
            <svg
              v-else-if="item.path === '/admin/box-prices'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <!-- Addresses Icon -->
            <svg
              v-else-if="item.path === '/admin/addresses'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- Mobile Logout -->
        <div class="absolute bottom-4 w-full px-4">
          <button
            @click="handleLogout"
            class="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sair
          </button>
        </div>
      </nav>
    </div>

    <!-- Desktop sidebar -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:bg-white lg:shadow-lg lg:flex lg:flex-col"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 bg-aux-orange flex-shrink-0">
        <LogoIcon :width="40" :height="44" />
        <span class="ml-2 text-xl font-bold text-white">Admin</span>
      </div>

      <!-- Desktop Navigation -->
      <nav class="mt-8 flex-1">
        <div class="px-4 space-y-2">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
              isActiveRoute(item.path)
                ? 'bg-aux-orange text-white'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            <!-- Dashboard Icon -->
            <svg
              v-if="item.path === '/admin/dashboard'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
              />
            </svg>
            <!-- Products Icon -->
            <svg
              v-else-if="item.path === '/admin/products'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <!-- Categories Icon -->
            <svg
              v-else-if="item.path === '/admin/categories'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <!-- Box Prices Icon -->
            <svg
              v-else-if="item.path === '/admin/box-prices'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <!-- Addresses Icon -->
            <svg
              v-else-if="item.path === '/admin/addresses'"
              class="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- Desktop Logout -->
        <div class="absolute bottom-4 w-full px-4">
          <button
            @click="handleLogout"
            class="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sair
          </button>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="lg:ml-64">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 lg:px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <!-- Mobile menu button -->
              <button
                @click="mobileMenuOpen = true"
                class="lg:hidden -ml-2 mr-2 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-aux-orange"
              >
                <span class="sr-only">Abrir menu</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <h1 class="text-xl lg:text-2xl font-semibold text-gray-900">
                {{ pageTitle }}
              </h1>
            </div>

            <div class="flex items-center space-x-2 lg:space-x-4">
              <span class="text-xs lg:text-sm text-gray-500 hidden sm:block">
                Bem-vindo, {{ adminInfo?.username }}
              </span>
              <NuxtLink
                to="/"
                target="_blank"
                class="text-xs lg:text-sm text-aux-orange hover:text-opacity-80"
              >
                Ver Site →
              </NuxtLink>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import LogoIcon from '../components/icons/LogoIcon.vue'
const router = useRouter()
const route = useRoute()

// Mobile menu state
const mobileMenuOpen = ref(false)

// Get admin info from cookie
const adminInfo = useCookie('admin-info')

// Navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
  },
  {
    name: 'Produtos',
    path: '/admin/products',
  },
  {
    name: 'Categorias',
    path: '/admin/categories',
  },
  {
    name: 'Preços das Cestas',
    path: '/admin/box-prices',
  },
  {
    name: 'Endereços',
    path: '/admin/addresses',
  },
]

// Page titles
const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Gerenciar Produtos',
  '/admin/categories': 'Gerenciar Categorias',
  '/admin/box-prices': 'Preços das Cestas',
  '/admin/addresses': 'Gerenciar Endereços',
}

const pageTitle = computed(() => {
  const path = route.path
  return pageTitles[path] || 'Painel Administrativo'
})

// Check if route is active
const isActiveRoute = path => {
  if (path === '/admin/dashboard') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)

const handleLogout = () => {
  // Clear auth cookies
  const token = useCookie('admin-token')
  const info = useCookie('admin-info')

  token.value = null
  info.value = null

  // Redirect to login
  router.push('/admin/login')
}

// Check authentication on mount
onMounted(() => {
  const token = useCookie('admin-token')
  if (!token.value) {
    router.push('/admin/login')
  }
})
</script>

<style scoped>
/* Ensure smooth transitions */
.transform {
  transition-property: transform;
}
</style>
