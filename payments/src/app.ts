import express from 'express'
import 'express-async-errors'
import { createChargeRouter } from './routes/new'

import { json } from 'body-parser'

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@concertmicroservice/common'

import cookieSession from 'cookie-session'
const app = express()

app.set('trust proxy', true)
// @ts-ignore
app.use(json())

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', //only work for https connection, remove this if u want to work with http
  })
)
app.use(currentUser)
app.use(createChargeRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
