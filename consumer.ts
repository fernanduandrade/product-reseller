
import amqp from 'amqplib'
import { PrismaClient } from '@prisma/client'
import { Sale } from '@/helpers/types';
const prisma = new PrismaClient()
const QUEUE_NAME = 'sales';

async function consumeMessage() {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME);
    channel.consume(QUEUE_NAME, async (message) => {
      if(message !== null) {
        const payload: Sale = JSON.parse(message.content.toString())
        const sale = await prisma.sales.create({
          data: {
            employeeId: payload.employeeCode,
            productName: payload.productName,
            totalPrice: payload.totalPrice,
            quantity: payload.quantity,
            dateSale: new Date(payload.dateSale).toISOString(),
          },
        })
        console.log('Received message:', message.content.toString())
        console.log('Received message:', JSON.stringify(sale))
        channel.ack(message);
      }
      
    });
  } catch (error) {
    console.error(error);
  }
}

consumeMessage();