<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <LogoIcon :width="80" :height="88" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Acesso Administrativo</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Entre com suas credenciais para acessar o painel admin
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Usuário</label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm"
                placeholder="Digite seu usuário"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-aux-orange focus:border-aux-orange sm:text-sm pr-10"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Erro de autenticação</h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-aux-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aux-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div
                  class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
              </span>
              {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>
        </form>

        <!-- Back to site -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-aux-orange hover:text-opacity-80">
            ← Voltar ao site
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LogoIcon from '~/components/icons/LogoIcon.vue'
definePageMeta({
  layout: false,
})

const router = useRouter()

const form = ref({
  username: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const { apiCall } = useApi()

const handleLogin = async () => {
  if (isLoading.value) return

  isLoading.value = true
  error.value = ''

  try {
    const response = await apiCall('/api/admin/login', {
      method: 'POST',
      body: {
        username: form.value.username,
        password: form.value.password,
      },
    })

    // Store auth token
    const token = useCookie('admin-token', {
      default: () => null,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    token.value = response.token

    // Store admin info
    const adminInfo = useCookie('admin-info', {
      default: () => null,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    })

    adminInfo.value = response.admin

    // Redirect to admin dashboard
    await router.push('/admin/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    if (error.data?.error) {
      error.value = error.data.error
    } else {
      error.value = 'Erro interno do servidor. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
