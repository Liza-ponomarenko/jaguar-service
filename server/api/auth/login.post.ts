import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Пользователь не найден' })
  }

  const isValid = await bcrypt.compare(body.password, user.password)

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль' })
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  }
})
