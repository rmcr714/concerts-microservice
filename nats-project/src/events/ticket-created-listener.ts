import { Listener } from './base-listener'
import { Message } from 'node-nats-streaming'
import { Subjects } from './subjects'
import { ticketCreatedEvent } from './ticket-created-event'

export class TicketCreatedListener extends Listener<ticketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = 'paymentsService'
  onMessage(data: ticketCreatedEvent['data'], msg: Message) {
    console.log('data!', data)
    msg.ack()
  }
}
