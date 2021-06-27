import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { OrderEventHandler } from './events/publisher/order-publish-event-handler' //
import { OrderEvent } from './models/events' //
import internalEventEmitter from './events/internalEventEmitter' //
import cron from 'node-cron' //
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is undefined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URL  is undefined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID  is undefined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL  is undefined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID  is undefined')
  }

  try {
    //connect to nats server, using singleton principle here
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    //close the nats server when user exits with crtl+c or terminates the program
    natsWrapper.client.on('close', () => {
      console.log('Nats server disconnected')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    //capture events when nats in down
    const orderEventHandler = new OrderEventHandler(OrderEvent)
    const cronjob = cron.schedule('*/2 * * * *', async () => {
      await orderEventHandler.handle()
    })
    // Attach Listener for InternalEvents
    internalEventEmitter.on('newNatsEvent', async () => {
      try {
        cronjob.stop()
        await orderEventHandler.handle()
      } catch (e) {
        console.log(e.message)
      } finally {
        cronjob.start()
      }
    })

    //listeners to listen for ticket created events
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()

    //connect to the kubernetes mongo ticket pod (Not using persistence volume ,will use it in production)
    await mongoose.connect(process.env.MONGO_URI, {
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
