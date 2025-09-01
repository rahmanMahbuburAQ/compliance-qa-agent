import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isComplianceOfficer = computed(() => user.value?.role === 'compliance_officer')
  const canAccessAudit = computed(() => 
    ['auditor', 'compliance_officer', 'admin'].includes(user.value?.role || '')
  )
  const hasComplianceAccess = computed(() => 
    ['compliance_officer', 'admin'].includes(user.value?.role || '')
  )

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Login API response:', data)
      
      if (!data || !data.user) {
        throw new Error('Invalid response from login API')
      }
      
      user.value = data.user
      
      const authCookie = useCookie('auth-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 8 // 8 hours
      })
      authCookie.value = data.token
      
      await navigateTo('/dashboard')
    } catch (error) {
      console.log("AAA", user);
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      
      const authCookie = useCookie('auth-token')
      authCookie.value = null
      
      await navigateTo('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const fetchUser = async () => {
    try {
      console.log('Fetching user from /api/auth/me')
      const response = await fetch('/api/auth/me')
      console.log('Auth response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('User data received:', data)
        user.value = data
      } else {
        console.log('Auth response not ok, clearing user')
        user.value = null
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      user.value = null
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    isComplianceOfficer,
    canAccessAudit,
    hasComplianceAccess,
    login,
    logout,
    fetchUser
  }
})