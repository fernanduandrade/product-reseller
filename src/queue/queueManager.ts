import { Channel } from 'amqplib'
import amqp from 'amqplib/callback_api'

export default {
  async connect() {
    return new Promise((resolve, reject) => {
      amqp.connect('amqp://localhost', (err, conn) => {
        if(err) {
          reject(err)
        }
  
        conn.createChannel((error, channel) => {
          if(error) {
            reject(error)
          }
  
          resolve(channel)
        })
      })
    })
  },
  sendMessageToQueue(channel: Channel, queueName: string, message: object) {
    channel.assertQueue(queueName, { durable: false})
  
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
  },
  consumeFromQueue(channel: Channel, queueName: string, callback: Function) {
    channel.assertQueue(queueName, { durable: false })
  
    channel.consume(queueName, function(message) {
      callback(message?.content.toString())
    }, { noAck: true })
  }
}

