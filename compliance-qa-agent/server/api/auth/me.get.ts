import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const token = getCookie(event, 'auth-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No authentication token found'
      })
    }

    const decoded = jwt.verify(token, config.authSecret) as any
    
    // Mock user lookup - replace with actual database query
    const user: User = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.email.split('@')[0],
      role: decoded.role,
      department: 'IT Security',
      lastLogin: new Date()
    }

    return user
    
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
})