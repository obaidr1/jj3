import { H3Event, defineEventHandler, createError, readBody } from 'h3'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { refreshToken } = await readBody(event)
    
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        message: 'No refresh token provided'
      })
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      id: string
      email: string
      role: string
    }
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid refresh token'
    })
  }
}) 