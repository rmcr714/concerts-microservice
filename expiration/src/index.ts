import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const start = async () => {
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

    //creating the instance of the listener
    new OrderCreatedListener(natsWrapper.client).listen()
  } catch (err) {
    console.log(err)
  }
}

start()
