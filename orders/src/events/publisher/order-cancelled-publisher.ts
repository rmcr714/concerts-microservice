import {
  Subjects,
  OrderCancelledEvent,
  Publisher,
} from '@concertmicroservice/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
