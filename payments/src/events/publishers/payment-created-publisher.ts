import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@concertmicroservice/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
