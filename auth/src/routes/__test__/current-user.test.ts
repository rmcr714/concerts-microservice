import request from 'supertest'
import { app } from '../../app'

it('returns details about the current user', async () => {
  const userCookie = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
  const cookie = userCookie.get('Set-Cookie')
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)
})

it('returns null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  expect(response.body.currentUser).toEqual(null)
})
