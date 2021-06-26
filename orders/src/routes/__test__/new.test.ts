import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@concertmicroservice/common'
import { natsWrapper } from '../../nats-wrapper'

it('Returns an error if the ticket doesnt exist', async () => {
  const ticketId = mongoose.Types.ObjectId()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404)
})

it('Returns an error if the ticket is already reserved', async () => {
 
  const ticket = Ticket.build({ id:new mongoose.Types.ObjectId().toHexString(),title: 'Linkin park', price: 20 })
  await ticket.save()

  const order = Order.build({
    userId: 'asdfdsfsd',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  })

  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('Reserves a ticket', async () => {
  //@ts-ignore
  const ticket = Ticket.build({id:new mongoose.Types.ObjectId().toHexString(), title: 'Green day', price: 20 })
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emit an order create event', async () => {
  
  const ticket = Ticket.build({id:new mongoose.Types.ObjectId().toHexString(), title: 'Green day', price: 20 })
  await ticket.save()

  await request(app)
    .post('/api/orders/')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
