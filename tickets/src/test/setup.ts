import request from 'supertest'
import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

jest.mock('../nats-wrapper')

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

global.signin = () => {
  //Build a jwt payload, {id,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }
  //create a jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  //build session object{jwt:data}
  const session = { jwt: token }
  //turn that session into JSON
  const sessionJSON = JSON.stringify(session)
  //take that json and encode it in base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  //returns a cookie that contains that cookie
  return [`express:sess=${base64}`]
}
