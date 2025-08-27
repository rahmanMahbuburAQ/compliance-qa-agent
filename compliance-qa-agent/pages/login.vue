<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $config.public.appName }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to access compliance resources
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in with SSO</span>
          </button>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
      </form>

      <div class="mt-6 text-xs text-gray-500 text-center">
        <p>Demo accounts:</p>
        <p>• admin@company.com (Admin)</p>
        <p>• compliance@company.com (Compliance Officer)</p>
        <p>• audit@company.com (Auditor)</p>
        <p>• employee@company.com (Employee)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const email = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value) return
  
  error.value = ''
  isLoading.value = true
  
  try {
    await authStore.login({ email: email.value })
  } catch (err) {
    error.value = err.data?.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}

// Redirect if already authenticated
watchEffect(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/dashboard')
  }
})
</script>