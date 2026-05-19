import prisma from '../../utils/prisma'

interface SessionUser {
  id: number
  email: string
  role: string
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userSession = session.user as SessionUser | undefined

  if (!userSession || userSession.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещён'
    })
  }

  return prisma.booking.findMany({
    include: {
      user: {
        select: {
          email: true,
          fullName: true
        }
      },
      car: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
})