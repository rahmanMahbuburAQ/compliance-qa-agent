import { defineStore } from 'pinia'

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentCategory = ref('all')
  const searchQuery = ref('')

  const categories = computed(() => {
    const cats = new Set(documents.value.map(doc => doc.category))
    return ['all', ...Array.from(cats)]
  })

  const filteredDocuments = computed(() => {
    let filtered = documents.value

    if (currentCategory.value !== 'all') {
      filtered = filtered.filter(doc => doc.category === currentCategory.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.sections.some(section =>
          section.title.toLowerCase().includes(query) ||
          section.content.toLowerCase().includes(query)
        )
      )
    }

    return filtered
  })

  const fetchDocuments = async (params?: { category?: string; search?: string }) => {
    isLoading.value = true
    error.value = null

    try {
      const query = new URLSearchParams()
      
      if (params?.category) {
        query.append('category', params.category)
        currentCategory.value = params.category
      }
      
      if (params?.search) {
        query.append('search', params.search)
        searchQuery.value = params.search
      }

      const response = await $fetch(`/api/documents?${query.toString()}`)

      documents.value = response.documents
      
    } catch (err) {
      error.value = err.data?.message || 'Failed to fetch documents'
      console.error('Documents fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getDocumentById = (id) => {
    return documents.value.find(doc => doc.id === id)
  }

  const searchDocuments = async (query) => {
    searchQuery.value = query
    await fetchDocuments({ 
      category: currentCategory.value, 
      search: query 
    })
  }

  const filterByCategory = async (category) => {
    currentCategory.value = category
    await fetchDocuments({ 
      category, 
      search: searchQuery.value 
    })
  }

  const getRecentDocuments = (limit = 5) => {
    return documents.value
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, limit)
  }

  return {
    documents: readonly(documents),
    filteredDocuments,
    isLoading: readonly(isLoading),
    error: readonly(error),
    categories,
    currentCategory: readonly(currentCategory),
    searchQuery: readonly(searchQuery),
    fetchDocuments,
    getDocumentById,
    searchDocuments,
    filterByCategory,
    getRecentDocuments
  }
})