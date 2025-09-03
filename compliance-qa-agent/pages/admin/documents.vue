<template>
  <div class="space-y-6">
    <div class="compliance-card">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Document Management</h1>
        <div class="flex space-x-3">
          <button
            @click="showUploadModal = true"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Upload PDF
          </button>
          <button
            @click="console.log('Add Document button clicked'); showCreateModal = true"
            class="btn-primary"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Document
          </button>
        </div>
      </div>

      <!-- Filter and Search -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search documents..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            v-model="selectedCategory"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Security">Security</option>
            <option value="Data Protection">Data Protection</option>
            <option value="Privacy">Privacy</option>
            <option value="External Relations">External Relations</option>
          </select>
        </div>
      </div>

      <!-- Documents Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sections
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="document in filteredDocuments" :key="document.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ document.title }}</div>
                  <div class="text-sm text-gray-500">{{ document.id }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="compliance-badge"
                  :class="getCategoryBadgeClass(document.category)"
                >
                  {{ document.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                v{{ document.version }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(document.lastUpdated) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ document.sections.length }} sections
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <a
                  v-if="document.url"
                  :href="document.url"
                  target="_blank"
                  class="text-green-600 hover:text-green-900"
                >
                  Download
                </a>
                <button
                  @click="editDocument(document)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <button
                  @click="deleteDocument(document)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredDocuments.length === 0" class="text-center py-12">
        <p class="text-gray-600">No documents found matching your criteria.</p>
      </div>
    </div>

    <!-- Create/Edit Document Modal -->
    <div v-if="showCreateModal || editingDocument" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingDocument ? 'Edit Document' : 'Create New Document' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveDocument" class="space-y-6">
            <!-- Basic Document Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Document ID</label>
                <input
                  v-model="documentForm.id"
                  :disabled="!!editingDocument"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., security_policy_v3"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input
                  v-model="documentForm.title"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Security Policy"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Version</label>
                <input
                  v-model="documentForm.version"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3.0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select
                  v-model="documentForm.category"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Security">Security</option>
                  <option value="Data Protection">Data Protection</option>
                  <option value="Privacy">Privacy</option>
                  <option value="Compliance">Compliance</option>
                  <option value="External Relations">External Relations</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Document URL</label>
                <input
                  v-model="documentForm.url"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/documents/policy.pdf"
                />
              </div>
            </div>

            <!-- Document Sections -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <label class="block text-sm font-medium text-gray-700">Document Sections</label>
                <button
                  type="button"
                  @click="addSection"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Section
                </button>
              </div>

              <div v-for="(section, index) in documentForm.sections" :key="index" class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-start mb-3">
                  <h4 class="text-sm font-medium text-gray-700">Section {{ index + 1 }}</h4>
                  <button
                    type="button"
                    @click="removeSection(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label class="block text-xs text-gray-600">Section Number</label>
                    <input
                      v-model="section.sectionNumber"
                      type="text"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 1.1"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600">Section Title</label>
                    <input
                      v-model="section.title"
                      type="text"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Access Control"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs text-gray-600">Section Content</label>
                  <textarea
                    v-model="section.content"
                    rows="4"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the policy content for this section..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="btn-primary"
              >
                {{ saving ? 'Saving...' : (editingDocument ? 'Update Document' : 'Create Document') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Upload PDF Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Upload PDF Compliance Document</h3>
            <button
              @click="closeUploadModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="uploadPDF" class="space-y-6">
            <!-- Basic Document Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Document ID *</label>
                <input
                  v-model="uploadForm.id"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., security_policy_v3"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Title *</label>
                <input
                  v-model="uploadForm.title"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Security Policy"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Version *</label>
                <input
                  v-model="uploadForm.version"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3.0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  v-model="uploadForm.category"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Security">Security</option>
                  <option value="Data Protection">Data Protection</option>
                  <option value="Privacy">Privacy</option>
                  <option value="Compliance">Compliance</option>
                  <option value="External Relations">External Relations</option>
                </select>
              </div>
            </div>

            <!-- PDF File Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">PDF File *</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div class="space-y-1 text-center">
                  <svg v-if="!selectedFile" class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div v-if="selectedFile" class="text-sm text-green-600">
                    <svg class="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ selectedFile.name }}
                  </div>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>{{ selectedFile ? 'Change file' : 'Upload a file' }}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".pdf"
                        required
                        class="sr-only"
                        @change="handleFileSelect"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PDF files only, up to 10MB</p>
                </div>
              </div>
            </div>

            <!-- Optional Sections -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Document Sections (Optional)</label>
              <p class="text-sm text-gray-500 mb-3">You can add sections here or leave empty if the PDF contains all content.</p>
              
              <div v-for="(section, index) in uploadForm.sections" :key="index" class="border border-gray-200 rounded-lg p-4 mb-3">
                <div class="flex justify-between items-start mb-3">
                  <h4 class="text-sm font-medium text-gray-700">Section {{ index + 1 }}</h4>
                  <button
                    type="button"
                    @click="removeUploadSection(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    v-model="section.sectionNumber"
                    type="text"
                    placeholder="Section Number (e.g., 1.1)"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    v-model="section.title"
                    type="text"
                    placeholder="Section Title"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <textarea
                  v-model="section.content"
                  rows="3"
                  placeholder="Section Content (optional)"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="button"
                @click="addUploadSection"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Section
              </button>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeUploadModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="uploading || !selectedFile"
                class="btn-primary"
              >
                {{ uploading ? 'Uploading...' : 'Upload & Create Document' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const authStore = useAuthStore()

// Check if user has admin access (moved to onMounted to avoid Pinia initialization issues)
onMounted(() => {
  console.log('Admin documents page mounted')
  console.log('User:', authStore.user)
  console.log('isAdmin:', authStore.isAdmin)
  console.log('hasComplianceAccess:', authStore.hasComplianceAccess)
  
  if (!authStore.isAdmin && !authStore.hasComplianceAccess) {
    console.error('Access denied - insufficient permissions')
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin or compliance officer role required.'
    })
  }
  
  console.log('Permissions OK, fetching documents...')
  fetchDocuments()
})

const documents = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const showCreateModal = ref(false)
const editingDocument = ref(null)
const saving = ref(false)

// Upload modal state
const showUploadModal = ref(false)
const uploading = ref(false)
const selectedFile = ref(null)

const uploadForm = ref({
  id: '',
  title: '',
  version: '',
  category: '',
  sections: []
})

const documentForm = ref({
  id: '',
  title: '',
  version: '',
  category: '',
  url: '',
  sections: []
})

const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (selectedCategory.value) {
    filtered = filtered.filter(doc => doc.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.id.toLowerCase().includes(query) ||
      doc.sections.some(section =>
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query)
      )
    )
  }

  return filtered
})

const fetchDocuments = async () => {
  try {
    const response = await $fetch('/api/admin/documents')
    documents.value = response.documents
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  }
}

const editDocument = (document) => {
  console.log('Edit clicked for document:', document.id)
  editingDocument.value = document
  documentForm.value = {
    id: document.id,
    title: document.title,
    version: document.version,
    category: document.category,
    url: document.url,
    sections: [...document.sections.map(s => ({...s}))]
  }
}

const deleteDocument = async (document) => {
  console.log('Delete clicked for document:', document.id)
  if (!confirm(`Are you sure you want to delete "${document.title}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/documents/${document.id}`, {
      method: 'DELETE'
    })
    await fetchDocuments()
  } catch (error) {
    console.error('Failed to delete document:', error)
    alert('Failed to delete document. Please try again.')
  }
}

const saveDocument = async () => {
  saving.value = true
  
  try {
    const payload = {
      ...documentForm.value,
      lastUpdated: new Date().toISOString(),
      sections: documentForm.value.sections.map(section => ({
        ...section,
        id: section.id || `${section.sectionNumber}_${Date.now()}`
      }))
    }

    if (editingDocument.value) {
      await $fetch(`/api/admin/documents/${documentForm.value.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/admin/documents', {
        method: 'POST',
        body: payload
      })
    }

    await fetchDocuments()
    closeModal()
  } catch (error) {
    console.error('Failed to save document:', error)
    alert('Failed to save document. Please try again.')
  } finally {
    saving.value = false
  }
}

const addSection = () => {
  documentForm.value.sections.push({
    id: '',
    title: '',
    content: '',
    sectionNumber: `${documentForm.value.sections.length + 1}.1`
  })
}

const removeSection = (index) => {
  documentForm.value.sections.splice(index, 1)
}

const closeModal = () => {
  showCreateModal.value = false
  editingDocument.value = null
  documentForm.value = {
    id: '',
    title: '',
    version: '',
    category: '',
    url: '',
    sections: []
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
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
      return 'compliance-badge-info'
  }
}

// Upload functionality
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB')
      return
    }
    selectedFile.value = file
  } else {
    alert('Please select a PDF file')
    selectedFile.value = null
  }
}

const uploadPDF = async () => {
  if (!selectedFile.value) {
    alert('Please select a PDF file')
    return
  }

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('id', uploadForm.value.id)
    formData.append('title', uploadForm.value.title)
    formData.append('version', uploadForm.value.version)
    formData.append('category', uploadForm.value.category)
    formData.append('sections', JSON.stringify(uploadForm.value.sections))

    const response = await $fetch('/api/admin/documents/upload', {
      method: 'POST',
      body: formData
    })

    console.log('Upload successful:', response)
    await fetchDocuments()
    closeUploadModal()
    alert('Document uploaded successfully!')

  } catch (error) {
    console.error('Upload failed:', error)
    alert('Failed to upload document. Please try again.')
  } finally {
    uploading.value = false
  }
}

const addUploadSection = () => {
  uploadForm.value.sections.push({
    id: '',
    title: '',
    content: '',
    sectionNumber: `${uploadForm.value.sections.length + 1}.1`
  })
}

const removeUploadSection = (index) => {
  uploadForm.value.sections.splice(index, 1)
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  uploadForm.value = {
    id: '',
    title: '',
    version: '',
    category: '',
    sections: []
  }
  // Reset file input
  const fileInput = document.getElementById('file-upload')
  if (fileInput) fileInput.value = ''
}

// Documents are now loaded in the auth check onMounted above
</script>