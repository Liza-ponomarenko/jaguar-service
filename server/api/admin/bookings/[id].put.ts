import prisma from '../../../utils/prisma'
import { transporter } from '../../../utils/mailer'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: body.status
    },
    include: {
      user: true
    }
  })

  await transporter.sendMail({
    to: booking.user.email,
    subject: 'Статус заявки изменён',
    text: `Статус вашей заявки "${booking.service}" изменён на: ${body.status}`
  })

  return booking
})