import { Message, Stan } from 'node-nats-streaming';

export abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // If a subscriber connects, attempt to dump all possible events on it. Combine w/ durable names to avoid sending already-processed events 📜
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        // Set custom ack timeout period ⏱
        .setAckWait(this.ackWait)
        // Durable names let NATS track which events going to a particular subscriber (by name) have been processed so we can limit rebroadcasts to only unprocessed events 🔥
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    // Data can be a string or a Buffer, add logic to massage Buffer into string if needed
    return JSON.parse(typeof data === 'string' ? data : data.toString('utf8'));
  }
}

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';
  onMessage(data: any, msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}
