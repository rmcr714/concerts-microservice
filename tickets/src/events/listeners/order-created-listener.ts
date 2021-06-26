import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@concertmicroservice/common'
import { Message } from 'node-nats-streaming'
import { UserEvent } from '../../models/events'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import InternalEventEmitter from '../internalEventEmitter'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    //if no ticket then throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    //mark the ticket as reserved by setting the orderId property if ticket is found
    ticket.set({ orderId: data.id })

    //save the ticket
    await ticket.save()

    //publidhing the updated tickets
    const event = UserEvent.build({
      //
      name: Subjects.TicketUpdated, //
      data: {
        //
        id: ticket.id, //
        title: ticket.title, //
        price: ticket.price, //
        userId: ticket.userId, //
        version: ticket.version,
        orderId: ticket.orderId,
      },
    })

    await event.save()

    InternalEventEmitter.emitNatsEvent()

    //ack the message
    msg.ack()
  }
}
