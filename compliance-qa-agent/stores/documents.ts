import { defineStore } from 'pinia'
import type { ComplianceDocument } from '~/types'

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<ComplianceDocument[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentCategory = ref<string>('all')
  const searchQuery = ref<string>('')

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

      const { data } = await $fetch<{
        documents: ComplianceDocument[]
        total: number
      }>(`/api/documents?${query.toString()}`)

      documents.value = data.documents
      
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch documents'
      console.error('Documents fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getDocumentById = (id: string): ComplianceDocument | undefined => {
    return documents.value.find(doc => doc.id === id)
  }

  const searchDocuments = async (query: string) => {
    searchQuery.value = query
    await fetchDocuments({ 
      category: currentCategory.value, 
      search: query 
    })
  }

  const filterByCategory = async (category: string) => {
    currentCategory.value = category
    await fetchDocuments({ 
      category, 
      search: searchQuery.value 
    })
  }

  const getRecentDocuments = (limit = 5): ComplianceDocument[] => {
    return documents.value
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
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