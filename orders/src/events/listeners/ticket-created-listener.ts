import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import {
  Listener,
  Subjects,
  ticketCreatedEvent,
} from '@concertmicroservice/common'
import { Ticket } from '../../models/ticket'

export class TicketCreatedListener extends Listener<ticketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated

  queueGroupName = queueGroupName

  async onMessage(data: ticketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    const ticket = Ticket.build({ id, title, price })
    await ticket.save()

    msg.ack()
  }
}
