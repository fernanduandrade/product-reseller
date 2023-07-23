import { PrismaClient } from '@prisma/client'
import { SaleMessage } from '@/helpers/types'
const prisma = new PrismaClient()

let queue: string;

export default {
  init(queueName: string) {
    queue = queueName;
  },
  async messageReceivedEvent (message: string) {
    if(message !== null) {
      const payload: SaleMessage = JSON.parse(message)
      console.log(payload)
      console.log(payload.data)
      await prisma.sales.create({
        data: {
          employeeId: payload.data.employeeCode,
          productName: payload.data.productName,
          totalPrice: payload.data.totalPrice,
          quantity: payload.data.quantity,
          dateSale: new Date(payload.data.dateSale).toISOString(),
        },
      })
    }
  }
}
