import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from '@concertmicroservice/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import InternalEventEmitter from '../internalEventEmitter'
import { UserEvent } from '../../models/events'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    //if no ticket then throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    //mark the ticket as reserved by setting the orderId property if ticket is found
    ticket.set({ orderId: undefined })

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
