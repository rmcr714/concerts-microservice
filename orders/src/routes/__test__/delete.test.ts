import { OrderStatus } from '@concertmicroservice/common'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

it('marks an order as cancelled', async () => {
  //create a ticket with the ticket model
  //@ts-ignore
  const ticket = Ticket.build({ id:new mongoose.Types.ObjectId().toHexString(),title: 'Green day', price: 20 })
  await ticket.save()

  const user = global.signin()
  //make a request to create an order for the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  //expectation that the order was cancelled
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo('emits an order cancel event')
