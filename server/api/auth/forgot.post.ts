import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.email || !body.email.includes('@')) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Введите корректный email' 
    })
  }

  // Проверяем существование пользователя
  const user = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (!user) {
    // Для безопасности не раскрываем, существует ли email
    return {
      message: 'Если аккаунт существует, инструкция по восстановлению отправлена на email'
    }
  }

  // TODO: Здесь интеграция с сервисом отправки писем (Resend, SendGrid, SMTP)
  // const resetToken = generateResetToken(user.id)
  // await sendEmail(body.email, 'reset-password', { token: resetToken })

  return {
    message: `Инструкция по восстановлению отправлена на ${body.email}`
  }
})