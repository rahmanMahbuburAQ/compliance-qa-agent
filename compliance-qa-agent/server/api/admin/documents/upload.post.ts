import { promises as fs } from 'fs'
import path from 'path'
import { createDocument } from '~/server/utils/database.js'

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add admin access validation
    
    const form = await readMultipartFormData(event)
    
    if (!form) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data received'
      })
    }

    let documentData: any = {}
    let pdfFile: any = null

    // Parse form data
    for (const item of form) {
      if (item.name === 'file' && item.filename) {
        pdfFile = item
      } else if (item.name && item.data) {
        const value = item.data.toString('utf-8')
        if (item.name === 'sections') {
          try {
            documentData[item.name] = JSON.parse(value)
          } catch {
            documentData[item.name] = []
          }
        } else {
          documentData[item.name] = value
        }
      }
    }

    // Validate required fields
    if (!documentData.id || !documentData.title || !documentData.version || !documentData.category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: id, title, version, category'
      })
    }

    // Validate PDF file
    if (!pdfFile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'PDF file is required'
      })
    }

    if (!pdfFile.filename?.toLowerCase().endsWith('.pdf')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only PDF files are allowed'
      })
    }

    // Create documents directory if it doesn't exist
    const documentsDir = path.join(process.cwd(), 'public', 'documents')
    try {
      await fs.access(documentsDir)
    } catch {
      await fs.mkdir(documentsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedId = documentData.id.replace(/[^a-zA-Z0-9-_]/g, '_')
    const filename = `${sanitizedId}_v${documentData.version}_${timestamp}.pdf`
    const filePath = path.join(documentsDir, filename)

    // Save file
    await fs.writeFile(filePath, pdfFile.data)

    // Create document with file URL
    const newDocument = {
      id: documentData.id,
      title: documentData.title,
      version: documentData.version,
      category: documentData.category,
      url: `/documents/${filename}`,
      sections: documentData.sections || []
    }

    const savedDocument = await createDocument(newDocument)
    
    // Log the admin action
    console.log('Admin action: UPLOAD_DOCUMENT', {
      documentId: documentData.id,
      filename,
      fileSize: pdfFile.data.length,
      timestamp: new Date(),
      // userId would come from JWT token
    })

    return {
      success: true,
      document: savedDocument,
      filename,
      message: 'Document uploaded and created successfully'
    }

  } catch (error) {
    console.error('Upload document error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to upload document'
    })
  }
})