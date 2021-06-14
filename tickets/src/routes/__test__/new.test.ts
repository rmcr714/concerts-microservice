import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

jest.mock('../../nats-wrapper')

it('has a route listeining on path /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(404)
})

it('returns 401 if the user is not signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401)
})

it('returns anything other than 401 if the user isnt signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ahhgdjss',
      price: -10,
    })
    .expect(400)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ahhgdjss',
    })
    .expect(400)
})

it('Creates a new Ticket with valid input', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ahhgdjss',
      price: 20,
    })
    .expect(201)
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
})
