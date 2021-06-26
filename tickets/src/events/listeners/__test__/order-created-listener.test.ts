import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCreatedEvent, OrderStatus } from '@concertmicroservice/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = Ticket.build({ title: 'concert', price: 20, userId: 'asdf' })
  await ticket.save()

  //create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sdgrd',
    expiresAt: 'asdddfs',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('Sets the user id of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket created event', async () => {
  const { listener, data, msg, ticket } = await setup()
})
