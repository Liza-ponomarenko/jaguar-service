import prisma from '../../utils/prisma'
import { transporter } from '../../utils/mailer'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден' })
  }

  await transporter.sendMail({
    from: '"Jaguar Service" <your@gmail.com>',
    to: email,
    subject: 'Восстановление пароля',
    text: `Ваш пароль: ${user.password}`
  })

  return { message: 'Письмо отправлено' }
})