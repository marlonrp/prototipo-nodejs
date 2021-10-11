const amqp = require("amqplib");
const { disconnect } = require("mongoose");

const CONNECTION_STRING = "amqp://localhost";

class QueueClient {
  constructor(queueName) {
    this.queueName = queueName;

    this.connection = null;
    this.channel = null;
    this.retry = 0;
  }

  async waitForConnection(maxRetry, interval = 1000) {
    console.log("... connecting to Queue ...");

    if (maxRetry > 0) {
      if (this.retry > maxRetry) {
        throw new Error("Exceeded Max Retry. Exiting ...");
      }
      this.retry++;
    }

    try {
      await this.connect();
      console.log("... connected to Queue ...");
    } catch (err) {
      console.log("Could not connect to Queue, retrying...");
      await this.wait(interval);
      await this.waitForConnection(maxRetry);
    }
  }

  async wait(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async connect() {
    this.connection = await amqp.connect(CONNECTION_STRING);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName);
    this.channel.prefetch(1);

    return null;
  }

  async disconnect() {
    await this.channel.close();
    await this.connection.close();
  }

  async produce(message) {
    if (!this.channel) {
      throw new Error("There is no connection to Queue");
    }

    await this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(message))
    );
  }

  // async consume() {
  //   return this.channel.consume(this.queueName, this.work, { noAck: false })
  // }

  // async work(msg) {
  //   console.log("PDF processing of ", msg.content.toString());
  //   try {
  //     ch.ack(msg);
  //     // ch.reject(msg, true);
  //   } catch (e) {
  //     await disconnect()
  //   }
  // }
}

module.exports = QueueClient;
