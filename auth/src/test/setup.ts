import request from 'supertest'
import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
    }
  }
}

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'anurag'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

//helper method to remove the repetitive sign in and sign up hassle to test other services

global.signin = async () => {
  const email = 'teat@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  const cookie = response.get('Set-Cookie')
  return cookie
}
