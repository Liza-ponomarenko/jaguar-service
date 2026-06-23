import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

const existing = await prisma.booking.findFirst({
  where: {
    bookingDate: new Date(body.bookingDate)
  }
})

if (existing) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Это время уже занято'
  })
}

  return prisma.booking.create({
  data: {
    service: body.service,
    comment: body.comment || null,
    bookingDate: new Date(body.bookingDate),
    userId: Number(body.userId),
    carId: Number(body.carId),
    status: 'PENDING'
  }
})
})