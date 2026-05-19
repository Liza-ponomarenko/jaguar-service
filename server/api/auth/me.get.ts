import prisma from '../../utils/prisma'

interface SessionUser {
  id: number
  email: string
  role: string
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userSession = session.user as SessionUser | undefined
  
  if (!userSession?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Не авторизован' })
  }

  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      region: true,
      city: true,
      role: true
    }
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Пользователь не найден' })
  }

  return user
})