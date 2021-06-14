import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'
console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

// @ts-ignore
stan.on('connect', async () => {
  console.log('Publisher connected to nats')

  const publisher = new TicketCreatedPublisher(stan)
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // })
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    })
  } catch (err) {
    console.error(err)
  }

  // stan.publish('ticket:created', data, () => {
  //   console.log('event published')
  // })
})