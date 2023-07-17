import express, { Express, Response, Request } from 'express'
import dotevn from 'dotenv'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import multer from 'multer'
import os from 'os'
import parse from 'csv-parse'
import { Employee, Sale } from '@/helpers/types'

const parser = parse.parse

const upload = multer({ dest: os.tmpdir() })

const prisma = new PrismaClient()

dotevn.config()

const app: Express = express()
const port = 3009
app.use(express.json())
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
    parser(data, async (err: any, records: any) => {
      if (err) {
        console.error(err)
        return res.status(400).json({ success: false, message: 'An error occurred' })
      }
      const employee = await prisma.sales.create({
        data: {
          employeeId: records[1][3],
          productName: records[1][1],
          totalPrice: parseInt(records[1][4], 10),
          quantity: parseInt(records[1][5], 10),
          dateSale: new Date(records[1][2]).toISOString(),
        },
      })
      res.status(201).json(employee)
      return res.json({ data: records })
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
