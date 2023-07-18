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
      const sale = await prisma.sales.create({
        data: {
          employeeId: payload.sale.employeeCode,
          productName: payload.sale.productName,
          totalPrice: payload.sale.totalPrice,
          quantity: payload.sale.quantity,
          dateSale: new Date(payload.sale.dateSale).toISOString(),
        },
      })
    }
  }
}
