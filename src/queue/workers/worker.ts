import amqpManager from '../queueManager'

export default{
  init(queueName: string, callbackEvent: Function) {
    amqpManager.connect().then((channel: any) => {
      amqpManager.consumeFromQueue(channel, queueName, callbackEvent)
    })
    .catch((error) => {
      console.log(error)
    })
  }
}