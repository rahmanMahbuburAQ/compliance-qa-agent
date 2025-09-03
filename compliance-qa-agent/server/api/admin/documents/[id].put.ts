import { updateDocument } from '~/server/utils/database.js'

export default defineEventHandler(async (event) => {
  const documentId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // TODO: Validate admin access with JWT
  
  const { title, version, category, url, sections } = body
  
  if (!title || !version || !category || !sections) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: title, version, category, sections'
    })
  }

  try {
    const updatedDocumentData = {
      title,
      version,
      category,
      url: url || `/documents/${documentId}.pdf`,
      lastUpdated: new Date(),
      sections: sections.map(section => ({
        id: section.id || `${section.sectionNumber}_${Date.now()}`,
        title: section.title,
        content: section.content,
        sectionNumber: section.sectionNumber
      }))
    }

    const updatedDocument = await updateDocument(documentId, updatedDocumentData)
    
    // Log the admin action
    console.log('Admin action: UPDATE_DOCUMENT', {
      documentId,
      timestamp: new Date(),
      // userId would come from JWT token
    })

    return {
      success: true,
      document: updatedDocument,
      message: 'Document updated successfully'
    }

  } catch (error) {
    console.error('Update document error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update document'
    })
  }
})