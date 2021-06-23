import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdated } from '@concertmicroservice/common'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdated> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdated['data'], msg: Message) {
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
    })
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    const { title, price } = data
    ticket.set({ title, price })
    await ticket.save()
    msg.ack()
  }
}
