import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const existingBooking = await prisma.booking.findFirst({
    where: {
      bookingDate: new Date(body.bookingDate)
    }
  })

  if (existingBooking) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Это время уже занято'
    })
  }

  return prisma.booking.create({
    data: {
      service: body.service,
      comment: body.comment,
      bookingDate: new Date(body.bookingDate),

      userId: Number(body.userId),
      carId: Number(body.carId)
    }
  })
})