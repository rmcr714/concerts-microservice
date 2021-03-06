import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { TicketEventHandler } from './events/publishers/ticket-publish-event-handler' //
import { UserEvent } from './models/events' //
import internalEventEmitter from './events/internalEventEmitter' //
import cron from 'node-cron' //
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

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
    const ticketEventHandler = new TicketEventHandler(UserEvent)
    const cronjob = cron.schedule('*/9 * * * *', async () => {
      await ticketEventHandler.handle()
    })
    // Attach Listener for InternalEvents
    internalEventEmitter.on('newNatsEvent', async () => {
      try {
        cronjob.stop()
        await ticketEventHandler.handle()
      } catch (e) {
        console.log(e.message)
      } finally {
        cronjob.start()
      }
    })

    //listeners to listen for order created events and cancelled events
    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

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
