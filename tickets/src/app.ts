import express from 'express'
import 'express-async-errors'

import { json } from 'body-parser'

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@concertmicroservice/common'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

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
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
