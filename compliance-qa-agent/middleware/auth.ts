export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  if (to.path.startsWith('/admin') && !authStore.isAdmin && !authStore.isComplianceOfficer) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied: Insufficient permissions'
    })
  }
  
  if (to.path.startsWith('/audit') && !authStore.canAccessAudit) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied: Auditor access required'
    })
  }
})