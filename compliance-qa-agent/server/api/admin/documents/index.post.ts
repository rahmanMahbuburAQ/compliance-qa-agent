import { createDocument } from '~/server/utils/database.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // TODO: Validate admin access with JWT
  
  const { id, title, version, category, url, sections } = body
  
  if (!id || !title || !version || !category || !sections) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: id, title, version, category, sections'
    })
  }

  try {
    const newDocument = {
      id,
      title,
      version,
      category,
      url: url || `/documents/${id}.pdf`,
      lastUpdated: new Date(),
      sections: sections.map(section => ({
        id: section.id || `${section.sectionNumber}_${Date.now()}`,
        title: section.title,
        content: section.content,
        sectionNumber: section.sectionNumber
      }))
    }

    const savedDocument = await createDocument(newDocument)
    
    // Log the admin action
    console.log('Admin action: CREATE_DOCUMENT', {
      documentId: id,
      timestamp: new Date(),
      // userId would come from JWT token
    })

    return {
      success: true,
      document: savedDocument,
      message: 'Document created successfully'
    }

  } catch (error) {
    console.error('Create document error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create document'
    })
  }
})