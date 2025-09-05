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

    // Extract text from PDF
    console.log('=== PDF EXTRACTION DEBUG START ===')
    console.log('PDF file size:', pdfFile.data.length, 'bytes')
    console.log('PDF filename:', pdfFile.filename)
    console.log('Document ID:', documentData.id)
    
    let extractedSections = []
    
    // Try PDF parsing first, fallback to manual entry if it fails
    try {
      console.log('Attempting PDF text extraction...')
      
      // Validate PDF header
      const pdfBuffer = Buffer.isBuffer(pdfFile.data) ? pdfFile.data : Buffer.from(pdfFile.data)
      const pdfHeader = pdfBuffer.slice(0, 4).toString()
      console.log('PDF header check:', pdfHeader === '%PDF' ? 'Valid PDF' : `Invalid PDF header: ${pdfHeader}`)
      
      if (pdfHeader === '%PDF') {
        console.log('PDF buffer created, size:', pdfBuffer.length)
        
        // Try PDF parsing with error isolation
        try {
          const pdfParse = await import('pdf-parse')
          console.log('pdf-parse loaded, attempting extraction...')
          
          const pdfData = await pdfParse.default(pdfBuffer, {
            max: 0,
            normalizeWhitespace: false,
            disableCombineTextItems: false
          })
          
          const extractedText = pdfData.text || ''
          console.log('PDF parsing completed. Text length:', extractedText.length)
          
          if (extractedText.length > 50) { // Only use if we got substantial text
            console.log('Processing text into sections...')
            extractedSections = processTextIntoSections(extractedText, documentData.id)
            console.log('Created', extractedSections.length, 'sections from PDF')
            
            if (extractedSections.length > 0) {
              console.log('✅ PDF parsing successful!')
            }
          } else {
            console.log('PDF text too short or empty, using fallback')
            throw new Error('Insufficient text extracted from PDF')
          }
        } catch (parseError) {
          console.log('PDF parsing failed:', parseError.message)
          throw parseError
        }
      } else {
        throw new Error('Invalid PDF format')
      }
      
    } catch (pdfError) {
      console.log('PDF extraction failed, creating manual entry section...')
      console.log('Error was:', pdfError.message)
      
      // Create manual entry section when PDF parsing fails
      extractedSections = [{
        id: `${documentData.id}_manual_${Date.now()}`,
        title: 'Document Content (Manual Entry Required)',
        content: `Document: ${pdfFile.filename}\nSize: ${pdfFile.data.length} bytes\n\nPDF content could not be automatically extracted. Please manually add the document content through the admin interface.\n\nReason: ${pdfError.message}`,
        sectionNumber: '1'
      }]
      console.log('✅ Manual entry section created as fallback')
    }
    
    console.log('=== PDF EXTRACTION DEBUG END ===')

    // Use extracted sections if available, otherwise use manual sections
    const sectionsToUse = extractedSections.length > 0 ? extractedSections : (documentData.sections || [])

    // Create document with file URL and extracted content
    const newDocument = {
      id: documentData.id,
      title: documentData.title,
      version: documentData.version,
      category: documentData.category,
      url: `/documents/${filename}`,
      sections: sectionsToUse
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

// Function to process extracted PDF text into sections
function processTextIntoSections(text: string, documentId: string) {
  const sections = []
  
  // Clean up the text
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  // Try to split by common section patterns
  const sectionPatterns = [
    /(\d+\.\d+\.?\s+[A-Z][^.\n]*[.:])/g,  // 1.1 Section Title
    /(\d+\.\s+[A-Z][^.\n]*[.:])/g,        // 1. Section Title
    /(Section\s+\d+[:\.]?\s*[A-Z][^.\n]*)/gi, // Section 1: Title
    /(Chapter\s+\d+[:\.]?\s*[A-Z][^.\n]*)/gi, // Chapter 1: Title
    /([A-Z][A-Z\s]{5,})/g                 // ALL CAPS headers
  ]
  
  let sectionMatches = []
  
  // Try each pattern to find section headers
  for (const pattern of sectionPatterns) {
    const matches = [...cleanText.matchAll(pattern)]
    if (matches.length > 0) {
      sectionMatches = matches
      break
    }
  }
  
  if (sectionMatches.length > 0) {
    // Split text by section headers
    for (let i = 0; i < sectionMatches.length; i++) {
      const match = sectionMatches[i]
      const nextMatch = sectionMatches[i + 1]
      
      const startIndex = match.index || 0
      const endIndex = nextMatch ? (nextMatch.index || cleanText.length) : cleanText.length
      
      const sectionHeader = match[1].trim()
      const sectionContent = cleanText.substring(startIndex, endIndex)
        .replace(match[0], '')
        .trim()
      
      if (sectionContent.length > 50) { // Only include substantial sections
        sections.push({
          id: `${documentId}_section_${i + 1}`,
          title: sectionHeader.replace(/[.:]$/, ''),
          content: sectionContent.substring(0, 2000), // Limit content length
          sectionNumber: (i + 1).toString()
        })
      }
    }
  }
  
  // If no clear sections found, split by paragraphs
  if (sections.length === 0) {
    const paragraphs = cleanText.split('\n\n').filter(p => p.trim().length > 100)
    
    paragraphs.forEach((paragraph, index) => {
      if (index < 10) { // Limit to 10 sections
        const title = paragraph.substring(0, 80).trim() + (paragraph.length > 80 ? '...' : '')
        sections.push({
          id: `${documentId}_para_${index + 1}`,
          title: title,
          content: paragraph.substring(0, 2000),
          sectionNumber: (index + 1).toString()
        })
      }
    })
  }
  
  // If still no sections, create one section with all content
  if (sections.length === 0) {
    sections.push({
      id: `${documentId}_full`,
      title: 'Full Document Content',
      content: cleanText.substring(0, 5000), // First 5000 chars
      sectionNumber: '1'
    })
  }
  
  return sections
}