export default defineEventHandler(async (event) => {
  try {
    // Clear the auth cookie
    setCookie(event, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    })

    // Log logout event
    const token = getCookie(event, 'auth-token')
    if (token) {
      // In a real app, decode token to get user ID for logging
      console.log('User logged out:', {
        timestamp: new Date(),
        ipAddress: getClientIP(event)
      })
    }

    return { success: true }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Logout failed'
    })
  }
})