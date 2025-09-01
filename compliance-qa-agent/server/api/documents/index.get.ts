import { getAllDocuments } from '~/server/utils/database.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { category, search } = query

  try {
    // Get documents from database (with fallback to mock data)
    const allDocuments = await getAllDocuments()

    let filteredDocuments = allDocuments

    // Filter by category
    if (category && category !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm) ||
        doc.sections.some(section =>
          section.title.toLowerCase().includes(searchTerm) ||
          section.content.toLowerCase().includes(searchTerm)
        )
      )
    }

    // Sort by last updated (newest first)
    filteredDocuments.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())

    return {
      documents: filteredDocuments,
      total: filteredDocuments.length
    }

  } catch (error) {
    console.error('Documents fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch compliance documents'
    })
  }
})