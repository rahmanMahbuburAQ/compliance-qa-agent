import { getAllDocuments } from '~/server/utils/database.js'

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add admin access validation
    
    const documents = await getAllDocuments()

    return {
      documents,
      total: documents.length
    }

  } catch (error) {
    console.error('Admin documents fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch documents'
    })
  }
})