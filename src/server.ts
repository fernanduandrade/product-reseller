import express, { Express, Response, Request } from 'express'
import dotevn from 'dotenv'

dotevn.config()

const app: Express = express()
const port = 3009

app.get('/', (req: Request, res: Response) => {
  res.send('aqwewqe')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
