import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return prisma.car.create({
    data: {
      brand: 'Jaguar',
      model: body.model,
      year: Number(body.year),
      userId: Number(body.userId)
    }
  })
})