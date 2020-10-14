import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
import * as cors from 'https://deno.land/x/cors/mod.ts'
import { gtfsToCatchme } from './catchme.ts'

const app = new Application()

app.use(cors.oakCors())

const router = new Router()

router.get('/', async ({ response }) => {
  response.body = {
    name: 'Catch me Creator API',
    version: '0.2.0',
    authors: ['https://github.com/Sh4rK', 'https://github.com/meszarosdezso'],
  }
})

router.post('/gtfs', async ({ response, request }) => {
  try {
    const path = request.url.searchParams.get('path')!
    const { gtfs } = await request.body().value

    await gtfsToCatchme(path || gtfs.data, { writeFile: true })

    response.body = { success: true }
  } catch (e) {
    response.body = { success: false, error: e.message }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Listening on port:1873')
await app.listen({ port: 1873 })
