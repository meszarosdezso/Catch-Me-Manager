import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
import * as cors from 'https://deno.land/x/cors/mod.ts'
import { fetchAllExported, fetchExported, gtfsToCatchme } from './catchme.ts'

const app = new Application()

app.use(cors.oakCors())

const router = new Router()

router.get('/', async ({ response }) => {
  response.body = {
    name: 'Catch me Creator API',
    version: '0.3.0',
    authors: ['https://github.com/Sh4rK', 'https://github.com/meszarosdezso'],
  }
})

router.get('/gtfs', async ({ response }) => {
  const files = await fetchAllExported()
  response.body = files
})

router.get('/gtfs/:fileName', async ({ response, params }) => {
  const { fileName } = params

  const data = await fetchExported(fileName!)

  response.body = { ...data }
  return
})

router.post('/gtfs', async ({ response, request }) => {
  try {
    const path = request.url.searchParams.get('path')!
    const { gtfs } = (await request.body().value) || { gtfs: null }

    const data = await gtfsToCatchme(path || gtfs.data, { writeFile: true })

    response.body = { success: true, path: `${data.agencies[0]}.json` }
  } catch (e) {
    response.body = { success: false, error: e.message }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Listening on port:1873')
await app.listen({ port: 1873 })
