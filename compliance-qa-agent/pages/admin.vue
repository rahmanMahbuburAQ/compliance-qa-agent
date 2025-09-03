<template>
  <div class="space-y-6">
    <div class="compliance-card">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <!-- Tab Navigation -->
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            @click="activeTab = 'dashboard'"
            :class="activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Dashboard
          </button>
          <button
            @click="switchToDocuments"
            :class="activeTab === 'documents' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Manage Documents
          </button>
          <button
            @click="activeTab = 'test-upload'"
            :class="activeTab === 'test-upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Test Upload
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'dashboard'">
      <!-- Stats Overview -->
      <div class="compliance-card">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-blue-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C7.512 15.042 9.201 13 12 13c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8c0 2.928 1.586 5.49 3.946 6.856"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Questions</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalQuestions?.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Documents</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalDocuments }}</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.avgConfidence }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Questions by Category -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Questions by Category</h2>
        <div class="space-y-4">
          <div 
            v-for="category in stats.questionsByCategory" 
            :key="category.category"
            class="flex items-center"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">{{ category.category }}</span>
                <span class="text-sm text-gray-600">{{ category.count }} ({{ category.percentage }}%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="`width: ${category.percentage}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Usage -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Daily Usage (Last 7 Days)</h2>
        <div class="space-y-3">
          <div 
            v-for="day in stats.dailyUsage" 
            :key="day.date"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-sm font-medium text-gray-700">
              {{ formatDate(day.date) }}
            </span>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>{{ day.questions }} questions</span>
              <span>{{ day.users }} users</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Questions -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Most Frequent Questions</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 text-xs font-medium text-gray-500 uppercase">Question</th>
                <th class="text-right py-2 text-xs font-medium text-gray-500 uppercase">Count</th>
                <th class="text-right py-2 text-xs font-medium text-gray-500 uppercase">Confidence</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="question in stats.topQuestions" :key="question.question">
                <td class="py-3 text-sm text-gray-900 max-w-xs truncate">
                  {{ question.question }}
                </td>
                <td class="py-3 text-sm text-gray-600 text-right">
                  {{ question.count }}
                </td>
                <td class="py-3 text-sm text-gray-600 text-right">
                  {{ question.avgConfidence }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Distribution -->
      <div class="compliance-card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Users by Role</h2>
        <div class="space-y-4">
          <div 
            v-for="role in stats.usersByRole" 
            :key="role.role"
            class="flex items-center"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 capitalize">
                  {{ role.role.replace('_', ' ') }}
                </span>
                <span class="text-sm text-gray-600">{{ role.count }} ({{ role.percentage }}%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full" 
                  :class="getRoleColor(role.role)"
                  :style="`width: ${role.percentage}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Stats -->
    <div class="compliance-card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Document Access Statistics</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase">Document</th>
              <th class="text-right py-3 text-xs font-medium text-gray-500 uppercase">Views</th>
              <th class="text-right py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th class="text-right py-3 text-xs font-medium text-gray-500 uppercase">Last Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="doc in stats.documentStats" :key="doc.document">
              <td class="py-4 text-sm text-gray-900">
                {{ doc.document }}
              </td>
              <td class="py-4 text-sm text-gray-600 text-right">
                {{ doc.views }}
              </td>
              <td class="py-4 text-sm text-gray-600 text-right">
                {{ doc.avgRating }}/5.0
              </td>
              <td class="py-4 text-sm text-gray-600 text-right">
                {{ formatDate(doc.lastUpdated) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- Documents Management Tab -->
    <div v-if="activeTab === 'documents'" class="compliance-card">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900">Document Management</h2>
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
            @click="showCreateModal = true"
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">v{{ document.version }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(document.lastUpdated) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ document.sections?.length || 0 }} sections</td>
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

    <!-- Test Upload Tab -->
    <div v-if="activeTab === 'test-upload'" class="compliance-card">
      <h2 class="text-xl font-bold mb-4">Upload Test Page</h2>
      <div class="flex space-x-3">
        <button
          @click="showUploadModal = true"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Upload PDF
        </button>
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Document
        </button>
      </div>

      <div v-if="showUploadModal" class="mt-4 p-4 border border-gray-200 rounded">
        <h3 class="font-bold">Upload Modal is Working!</h3>
        <button @click="showUploadModal = false" class="mt-2 px-3 py-1 bg-gray-200 rounded">
          Close
        </button>
      </div>
    </div>

    <!-- Upload PDF Modal (shared across all tabs) -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
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
                    {{ selectedFile.name }} ({{ Math.round(selectedFile.size / 1024) }}KB)
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

    <!-- Edit Document Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Edit Document</h3>
            <button
              @click="closeEditModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveEditDocument" class="space-y-6">
            <!-- Basic Document Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Document ID</label>
                <input
                  v-model="editForm.id"
                  type="text"
                  disabled
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Title *</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Version *</label>
                <input
                  v-model="editForm.version"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  v-model="editForm.category"
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
                  v-model="editForm.url"
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
                  @click="addEditSection"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Section
                </button>
              </div>

              <div v-for="(section, index) in editForm.sections" :key="index" class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-start mb-3">
                  <h4 class="text-sm font-medium text-gray-700">Section {{ index + 1 }}</h4>
                  <button
                    type="button"
                    @click="removeEditSection(index)"
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
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600">Section Title</label>
                    <input
                      v-model="section.title"
                      type="text"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="uploading"
                class="btn-primary"
              >
                {{ uploading ? 'Updating...' : 'Update Document' }}
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
  middleware: 'auth'
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const stats = ref({})
const loading = ref(false)
const activeTab = ref('dashboard')

// Document management state
const documents = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const showCreateModal = ref(false)
const showUploadModal = ref(false)
const showEditModal = ref(false)
const editingDocument = ref(null)
const uploading = ref(false)
const selectedFile = ref(null)

const uploadForm = ref({
  id: '',
  title: '',
  version: '',
  category: '',
  sections: []
})

const editForm = ref({
  id: '',
  title: '',
  version: '',
  category: '',
  url: '',
  sections: []
})

// Check if currently on documents page
const isOnDocumentsPage = computed(() => {
  return route.path === '/admin/documents'
})

// Filtered documents for the table
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
      doc.sections?.some(section =>
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query)
      )
    )
  }

  return filtered
})

const fetchStats = async () => {
  loading.value = true
  
  try {
    const data = await $fetch('/api/admin/stats')
    stats.value = data
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-red-600'
    case 'compliance_officer': return 'bg-purple-600'
    case 'auditor': return 'bg-yellow-600'
    case 'employee': return 'bg-blue-600'
    default: return 'bg-gray-600'
  }
}

const goToDocuments = () => {
  console.log('goToDocuments called1')
  console.log('Current user1:', authStore.user)
  console.log('isAdmin1:', authStore.isAdmin)
  console.log('isComplianceOfficer1:', authStore.isComplianceOfficer)
  
  // Switch to documents tab instead of navigating
  switchToDocuments()
}

const switchToDocuments = async () => {
  activeTab.value = 'documents'
  await fetchDocuments()
}

// Fetch documents for the documents tab
const fetchDocuments = async () => {
  try {
    const response = await $fetch('/api/admin/documents')
    documents.value = response.documents
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  }
}

// Document management functions
const editDocument = (document) => {
  console.log('Edit clicked for document:', document.id)
  editingDocument.value = document
  editForm.value = {
    id: document.id,
    title: document.title,
    version: document.version,
    category: document.category,
    url: document.url,
    sections: [...document.sections.map(s => ({...s}))]
  }
  showEditModal.value = true
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

const getCategoryBadgeClass = (category) => {
  switch (category?.toLowerCase()) {
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
    
    // Refresh documents list
    await fetchDocuments()
    
    // Close modal
    closeUploadModal()
    
    // Show success message
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

// Edit modal functions
const saveEditDocument = async () => {
  uploading.value = true
  
  try {
    const payload = {
      ...editForm.value,
      lastUpdated: new Date().toISOString(),
      sections: editForm.value.sections.map(section => ({
        ...section,
        id: section.id || `${section.sectionNumber}_${Date.now()}`
      }))
    }

    await $fetch(`/api/admin/documents/${editForm.value.id}`, {
      method: 'PUT',
      body: payload
    })

    await fetchDocuments()
    closeEditModal()
    alert('Document updated successfully!')

  } catch (error) {
    console.error('Failed to save document:', error)
    alert('Failed to save document. Please try again.')
  } finally {
    uploading.value = false
  }
}

const addEditSection = () => {
  editForm.value.sections.push({
    id: '',
    title: '',
    content: '',
    sectionNumber: `${editForm.value.sections.length + 1}.1`
  })
}

const removeEditSection = (index) => {
  editForm.value.sections.splice(index, 1)
}

const closeEditModal = () => {
  showEditModal.value = false
  editingDocument.value = null
  editForm.value = {
    id: '',
    title: '',
    version: '',
    category: '',
    url: '',
    sections: []
  }
}

// Load stats on mount with auth check
onMounted(() => {
  // Check admin permissions after Pinia is initialized
  if (!authStore.isAdmin && !authStore.isComplianceOfficer) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied: Admin or Compliance Officer access required'
    })
  }
  fetchStats()
})
</script>