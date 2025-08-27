<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="compliance-card">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Welcome back, {{ authStore.user?.name }}
      </h1>
      <p class="text-gray-600">
        Your one-stop destination for compliance questions and policy information.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions -->
      <div class="lg:col-span-2 space-y-6">
        <div class="compliance-card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink 
              to="/chat"
              class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C7.512 15.042 9.201 13 12 13c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8c0 2.928 1.586 5.49 3.946 6.856"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-900">Ask a Question</h3>
                <p class="text-sm text-gray-600">Get instant compliance answers</p>
              </div>
            </NuxtLink>

            <NuxtLink 
              to="/documents"
              class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-900">Browse Documents</h3>
                <p class="text-sm text-gray-600">View compliance policies</p>
              </div>
            </NuxtLink>

            <button 
              @click="reportIncident"
              class="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.734-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-900">Report Incident</h3>
                <p class="text-sm text-gray-600">Security incident reporting</p>
              </div>
            </button>

            <NuxtLink 
              v-if="authStore.canAccessAudit"
              to="/audit"
              class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-900">Audit Logs</h3>
                <p class="text-sm text-gray-600">Review compliance activity</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="compliance-card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div class="space-y-3">
            <div class="flex items-center text-sm">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span class="text-gray-600">You asked about file sharing policies</span>
              <span class="text-gray-400 ml-auto">2 hours ago</span>
            </div>
            <div class="flex items-center text-sm">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span class="text-gray-600">New security policy v2.1 published</span>
              <span class="text-gray-400 ml-auto">1 day ago</span>
            </div>
            <div class="flex items-center text-sm">
              <div class="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span class="text-gray-600">Data handling guidelines updated</span>
              <span class="text-gray-400 ml-auto">3 days ago</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- System Status -->
        <div class="compliance-card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Claude AI</span>
              <span class="compliance-badge compliance-badge-success">Online</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Document Database</span>
              <span class="compliance-badge compliance-badge-success">Online</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Audit Logging</span>
              <span class="compliance-badge compliance-badge-success">Active</span>
            </div>
          </div>
        </div>

        <!-- Recent Documents -->
        <div class="compliance-card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h2>
          <div class="space-y-3">
            <div v-for="doc in recentDocs" :key="doc.id" class="text-sm">
              <button 
                @click="viewDocument(doc)"
                class="text-blue-600 hover:text-blue-800 underline block"
              >
                {{ doc.title }}
              </button>
              <span class="text-gray-500">v{{ doc.version }} • {{ doc.category }}</span>
            </div>
          </div>
        </div>

        <!-- Compliance Tips -->
        <div class="compliance-card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Compliance Tip</h2>
          <div class="text-sm text-gray-600">
            <p class="font-medium text-gray-800 mb-2">Did you know?</p>
            <p>Always use company-approved platforms for file sharing. Personal email accounts like Gmail are not permitted for work files.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const documentsStore = useDocumentsStore()

const recentDocs = ref([
  {
    id: 'sec_policy_v2',
    title: 'Security Policy',
    version: '2.1',
    category: 'Security',
    url: '/documents/security-policy-v2.pdf'
  },
  {
    id: 'data_handling_v1',
    title: 'Data Handling Guidelines',
    version: '1.3',
    category: 'Data Protection',
    url: '/documents/data-handling-v1.pdf'
  },
  {
    id: 'privacy_policy_v3',
    title: 'Privacy Policy',
    version: '3.0',
    category: 'Privacy',
    url: '/documents/privacy-policy-v3.pdf'
  }
])

const reportIncident = () => {
  // In a real app, this would open an incident reporting form
  alert('Incident reporting feature would open here. For critical incidents, call the security hotline immediately.')
}

const viewDocument = (document) => {
  window.open(document.url, '_blank')
}

// Fetch user data on mount
onMounted(() => {
  if (!authStore.user) {
    authStore.fetchUser()
  }
})
</script>