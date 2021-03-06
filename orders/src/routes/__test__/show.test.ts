import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

it('Fetches a specific order', async () => {
  //create a ticket
  //@ts-ignore
  const ticket = Ticket.build({ id:new mongoose.Types.ObjectId().toHexString(),title: 'Green day', price: 20 })
  await ticket.save()

  const user = global.signin()

  //make a request to buid the order with the above ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({})
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if one user tries to fetch order of other user', async () => {
  //create a ticket
  //@ts-ignore
  const ticket = Ticket.build({ id:new mongoose.Types.ObjectId().toHexString(),title: 'Green day', price: 20 })
  await ticket.save()

  const user = global.signin()

  //make a request to buid the order with the above ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(401)
})
