import { Channel } from "amqplib";
import amqp from "amqplib/callback_api";

export default {
  async connect() {
    return new Promise((resolve, reject) => {
      amqp.connect("amqp://localhost", (err, conn) => {
        if (err) {
          reject(err);
        }

        conn.createChannel((error, channel) => {
          if (error) {
            reject(error);
          }

          resolve(channel);
        });
      });
    });
  },
  sendMessageToQueue(channel: Channel, queueName: string, message: object) {
    channel.assertQueue(queueName, { durable: false });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  },
  consumeFromQueue(channel: Channel, queueName: string, callback: Function) {
    channel.assertQueue(queueName, { durable: false });
    channel.prefetch(1);
    channel.consume(
      queueName,
      function (message) {
        setTimeout(() => {
          callback(message?.content.toString());
          channel.ack(message as any);
        }, 2000);
      },
      { noAck: false }
    );
  },
};
