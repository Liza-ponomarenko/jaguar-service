import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  return prisma.user.update({
    where: { id },
    data: {
      role: body.role
    }
  })
})