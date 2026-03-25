export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('Заявка:', body)
  return { status: 'ok' }
})
