<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">
                {{ $config.public.appName }}
              </h1>
            </NuxtLink>
            
            <nav class="hidden md:ml-6 md:flex md:space-x-8">
              <NuxtLink 
                to="/dashboard" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-blue-600 font-semibold"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink 
                to="/chat" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-blue-600 font-semibold"
              >
                Ask Question
              </NuxtLink>
              <NuxtLink 
                to="/documents" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-blue-600 font-semibold"
              >
                Documents
              </NuxtLink>
              <NuxtLink 
                v-if="authStore.canAccessAudit" 
                to="/audit" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-blue-600 font-semibold"
              >
                Audit
              </NuxtLink>
              <NuxtLink 
                v-if="authStore.isAdmin || authStore.isComplianceOfficer" 
                to="/admin" 
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-blue-600 font-semibold"
              >
                Admin
              </NuxtLink>
            </nav>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span class="compliance-badge compliance-badge-success">
                {{ authStore.user?.role?.replace('_', ' ').toUpperCase() }}
              </span>
              <span>{{ authStore.user?.name }}</span>
            </div>
            
            <button 
              @click="authStore.logout()"
              class="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
</script>