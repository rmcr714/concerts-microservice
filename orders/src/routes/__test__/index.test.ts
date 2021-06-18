import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('fetches orders for a particular user', async () => {
  //create three tickets
  const ticket1 = await Ticket.build({ title: 'green day', price: 20 })
  await ticket1.save()
  const ticket2 = await Ticket.build({ title: 'Likin park', price: 30 })
  await ticket2.save()
  const ticket3 = await Ticket.build({ title: 'foo fighters', price: 20 })
  await ticket3.save()

  const userOne = global.signin()
  const userTwo = global.signin()
  //create 1 order as user#1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201)

  //create 2 orders for user#2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201)
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201)

  //Make request to  get the 2 orders for user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  //make sure we only get order for user #2
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
})
