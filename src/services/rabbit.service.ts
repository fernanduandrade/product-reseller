import axios from 'axios'
import { MessagesResponse, Message } from '../helpers/types'
export const getRemainingMessages = async (queueName: string, queueId: string) => {
  const uri = `http://localhost:15672/api/queues/%2F/${queueName}/get`
  const response = await axios.post(uri, {
    count: 10000,
    requeue: true,
    encoding: 'auto',
    ackmode: 'ack_requeue_true'
  }, { auth: { username: 'guest', password: 'guest' } })

  const messages: MessagesResponse[] = response.data
  const messagesLeft = messages.filter(message => {
    const parsedMessage: Omit<Message, 'sale'> = JSON.parse(message.payload)
    if(parsedMessage.messageId === queueId)
      return message
  })

  return messagesLeft.length
}