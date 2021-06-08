import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('return 404 if the given ticekt id doesnt exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfds',
      price: 20,
    })
    .expect(404)
})

it('return 401 if the user isnt authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asfds',
      price: 20,
    })
    .expect(401)
})

it('return 401 if the user doesnt own the ticket', async () => {
  const response = await await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'asfadsf', price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'dfsdfs',
      price: 20,
    })
    .expect(401)
})

it('return 400 if the user provides an invalid ticket details', async () => {
  const cookie = global.signin()
  const response = await await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asfadsf', price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dsfsdf', price: -20 })
    .expect(400)
})

it('updates the ticket if all the details are correct', async () => {
  const cookie = global.signin()
  const response = await await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asfadsf', price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'gta', price: 20 })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})

  expect(ticketResponse.body.title).toEqual('gta')
})
