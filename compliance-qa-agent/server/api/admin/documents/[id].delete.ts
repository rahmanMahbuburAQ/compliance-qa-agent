import { deleteDocument } from '~/server/utils/database.js'

export default defineEventHandler(async (event) => {
  const documentId = getRouterParam(event, 'id')
  
  // TODO: Validate admin access with JWT
  
  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required'
    })
  }

  try {
    const deleted = await deleteDocument(documentId)
    
    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found'
      })
    }
    
    // Log the admin action
    console.log('Admin action: DELETE_DOCUMENT', {
      documentId,
      timestamp: new Date(),
      // userId would come from JWT token
    })

    return {
      success: true,
      message: 'Document deleted successfully'
    }

  } catch (error) {
    console.error('Delete document error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete document'
    })
  }
})