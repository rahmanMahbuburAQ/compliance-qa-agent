<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Global app setup
useHead({
  title: 'Compliance Q&A Agent',
  meta: [
    { name: 'description', content: 'Enterprise compliance Q&A system powered by Claude AI' }
  ]
})

// Initialize auth on app start
const authStore = useAuthStore()

onMounted(async () => {
  // Check if user is already authenticated
  const authCookie = useCookie('auth-token')
  if (authCookie.value && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      // Token might be expired, redirect to login
      if (process.client) {
        await navigateTo('/login')
      }
    }
  }
})
</script>