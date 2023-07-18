import express, { Express, Response, Request } from 'express'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import multer from 'multer'
import os from 'os'
import parse from 'csv-parse'
import { Employee, Sale } from '@/helpers/types'
import { v4 as uuidv4 } from 'uuid';
import workerManager from './queue/workerManager'
import amqpManager from './queue/queueManager'
workerManager.init()
const parser = parse.parse

const upload = multer({ dest: os.tmpdir() })

const prisma = new PrismaClient()

const app: Express = express()
const port = 3009
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req: Request, res: Response) => {
  res.send('online')
})

app.post('/emplooyes', async (req: Request, res: Response) => {
  const payload : Employee = req.body
  const employee = await prisma.employee.create({
    data: {
      documentId: payload.documentId,
      name: payload.name,
      active: payload.active,
      registrationDate: new Date(payload.registrationDate).toISOString(),
    },
  })
  res.status(201).json(employee)
})

app.post('/sales', async (req: Request, res: Response) => {
  const payload : Sale = req.body
  const employee = await prisma.sales.create({
    data: {
      employeeId: payload.employeeCode,
      productName: payload.productName,
      totalPrice: payload.totalPrice,
      quantity: payload.quantity,
      dateSale: new Date(payload.dateSale).toISOString(),
    },
  })
  res.status(201).json(employee)
})

app.post('/read-sales', upload.single('file'), (req: Request, res: Response) => {
  try {
    const { file } = req

    const data = fs.readFileSync(file!.path)
    parser(data, async (err: any, records: string[]) => {
      if (err) {
        console.error(err)
        return res.status(400).json({ success: false, message: 'An error occurred' })
      }
      const recordsLength = records.length - 1
      const sales: Sale[] = []
      const queueId = uuidv4()
      for(let i = 1; i < recordsLength; i++)
      {
        const sale: Sale = {
          productName: records[i][0],
          dateSale: records[i][1],
          employeeCode: records[i][2],
          totalPrice: parseInt(records[i][3], 10),
          quantity: parseInt(records[i][4], 10),
        }
        sales.push(sale)
        const message = { queueId, sale }
        amqpManager.connect().then((channel: any) => {
          amqpManager.sendMessageToQueue(channel, 'sales', message)
        })
      }
      
      return res.status(201).json({ requestId: queueId, data: sales })
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
