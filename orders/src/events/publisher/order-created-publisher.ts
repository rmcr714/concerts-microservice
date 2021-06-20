import {
  Subjects,
  OrderCreatedEvent,
  Publisher,
} from '@concertmicroservice/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
