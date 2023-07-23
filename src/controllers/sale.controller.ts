import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { Sale, QueueStatus } from '../helpers/types'
import { getRemainingMessages } from '../services/rabbit.service'
import multer from 'multer'
import os from 'os'
import fs from 'fs'
import amqpManager from '../queue/queueManager'
import { v4 as uuidv4 } from 'uuid'
import { getSalesFromCsv } from '../helpers/csv'

const prisma = new PrismaClient();
const { sales } = prisma;

const upload = multer({ dest: os.tmpdir() })
const router = Router()

router
  .get('/', async (req, res) => {
    const sale = await sales.findMany();

    return res.status(200).json(sale);
  })
  .post('/', async (req, res) => {
    const sale: Sale = req.body;

    const newSale = await sales.create({
      data: {
        employeeId: sale.employeeCode,
        productName: sale.productName,
        totalPrice: sale.totalPrice,
        quantity: sale.quantity,
        dateSale: new Date(sale.dateSale).toISOString(),
      },
    })

    return res.status(201).json(newSale);
  })
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const data = await sales.findFirst({ where: { id } });

    return res.status(200).json(data)
  })
  .get('/queue/status', async (req, res) => {
    const queueId = req.query.queueId
    const messagesLeft = await getRemainingMessages('sales', queueId as string);
    const queueProgress = await prisma.queue.findFirst({
      where: {
        queueId: queueId as string,
      },
    });

    const statusMessage = await prisma.queueStatus.findFirst({
      where: {
        id: queueProgress?.statusId,
      },
    });
    let status = statusMessage?.id
    if(queueProgress !== null) {
      if(messagesLeft === 0 && statusMessage!.statusName === 'IN PROGRESS') {
        const diff = {
          dateCreated: queueProgress.dateCreated,
          queueId: queueProgress?.queueId,
          statusId: QueueStatus.FINISHED,
          totalMessages: queueProgress.totalMessages,
          id: queueProgress.id
        }

        status = QueueStatus.FINISHED
        await prisma.queue.update({
          where: {id: queueProgress.id },
          data : diff
        })
      }
    }

    return res
      .status(200)
      .send({
        queueId: queueProgress?.id,
        messagesToProcess: messagesLeft,
        progressStatus: QueueStatus[status!],
        totalMessages: queueProgress?.totalMessages
      });
  })
  .patch('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ message: 'Required parameter id is missing!' });

    const sale = await sales.findFirst({ where: { id } });

    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    const changes: Partial<Sale> = req.body;

    const updatedSale = await sales.update({
      where: { id },
      data: changes,
    });

    return res.status(200).json(updatedSale);
  })
  .delete('/:id', async (req, res) => {
    const { id } = req.params;
    await sales.delete({ where: { id } });

    return res.status(200).json({ message: 'User deleted' });
  })
  .post('/upload-csv', upload.single('file'), async (req, res) => {
    try {
      const { file } = req
      const data = fs.readFileSync(file!.path)
      const sales = getSalesFromCsv(data)
      const messagesId = uuidv4()
      
      amqpManager.connect().then((channel: any) => {
        amqpManager.sendMessageListToQueue<Sale>(channel, 'sales', messagesId, sales)
      })

      await prisma.queue.create({
        data: {
          queueId: messagesId,
          totalMessages: sales.length,
          statusId: 1,
        },
      });
      return res
        .status(201)
        .json({ requestId: messagesId, message: 'process has been started' });
      

    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

export default router;
