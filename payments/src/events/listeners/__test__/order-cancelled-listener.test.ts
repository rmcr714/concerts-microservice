import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import mongoose from 'mongoose'
import { OrderCancelledEvent, OrderStatus } from '@concertmicroservice/common'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    version: 0,
    userId: 'asfdf',
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: '1232',
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, msg, data, order }
}

it('updates the status of the order to cancelled', async () => {
  const { listener, msg, data, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the messge', async () => {
  const { listener, msg, data, order } = await setup()

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
