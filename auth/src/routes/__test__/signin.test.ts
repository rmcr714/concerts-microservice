import request from 'supertest'
import { app } from '../../app'

it('Fails if email doesnot exist in the db', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'passwordhhgj' })
    .expect(400)
})

it('sesponds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
