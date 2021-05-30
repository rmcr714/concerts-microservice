import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is undefined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('conected to mongodb')
  } catch (err) {
    console.log(err)
  }
  app.listen(3000, () => {
    console.log('Auth listeining on port 3000')
  })
}

start()
