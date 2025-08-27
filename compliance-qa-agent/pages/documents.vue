<template>
  <div class="space-y-6">
    <div class="compliance-card">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Compliance Documents</h1>
      </div>

      <!-- Search and Filter -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Search documents..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <select
            v-model="selectedCategory"
            @change="onCategoryChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Security">Security</option>
            <option value="Data Protection">Data Protection</option>
            <option value="Privacy">Privacy</option>
          </select>
        </div>
      </div>

      <!-- Document Grid -->
      <div v-if="documentsStore.isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading documents...</p>
      </div>

      <div v-else-if="documentsStore.filteredDocuments.length === 0" class="text-center py-12">
        <p class="text-gray-600">No documents found matching your criteria.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="document in documentsStore.filteredDocuments"
          :key="document.id"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="viewDocument(document)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ document.title }}
              </h3>
              <p class="text-sm text-gray-600 mb-3">
                Version {{ document.version }}
              </p>
              
              <div class="flex items-center space-x-2 mb-3">
                <span 
                  class="compliance-badge"
                  :class="getCategoryBadgeClass(document.category)"
                >
                  {{ document.category }}
                </span>
              </div>
              
              <p class="text-sm text-gray-500 mb-4">
                Last updated: {{ formatDate(document.lastUpdated) }}
              </p>
              
              <!-- Document sections preview -->
              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-700">Key Sections:</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li v-for="section in document.sections.slice(0, 3)" :key="section.id">
                    {{ section.sectionNumber }} - {{ section.title }}
                  </li>
                  <li v-if="document.sections.length > 3" class="text-gray-500">
                    +{{ document.sections.length - 3 }} more sections
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <button
              @click.stop="viewDocument(document)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Document →
            </button>
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

const documentsStore = useDocumentsStore()

const searchQuery = ref('')
const selectedCategory = ref('all')

const onSearchInput = debounce(async () => {
  await documentsStore.searchDocuments(searchQuery.value)
}, 300)

const onCategoryChange = async () => {
  await documentsStore.filterByCategory(selectedCategory.value)
}

const viewDocument = (document) => {
  // In a real app, this would open the document or navigate to a detailed view
  window.open(document.url, '_blank')
  
  // Log document access for audit
  logDocumentAccess(document.id)
}

const logDocumentAccess = async (documentId) => {
  try {
    await $fetch('/api/audit/log', {
      method: 'POST',
      body: {
        action: 'VIEW_DOCUMENT',
        resource: documentId
      }
    })
  } catch (error) {
    console.error('Failed to log document access:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCategoryBadgeClass = (category) => {
  switch (category.toLowerCase()) {
    case 'security':
      return 'compliance-badge-danger'
    case 'data protection':
      return 'compliance-badge-warning'
    case 'privacy':
      return 'compliance-badge-success'
    default:
      return 'compliance-badge-success'
  }
}

// Debounce utility
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Load documents on mount
onMounted(() => {
  documentsStore.fetchDocuments()
})
</script>