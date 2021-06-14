import {
  Publisher,
  Subjects,
  ticketCreatedEvent,
} from '@concertmicroservice/common'

export class TicketCreatedPublisher extends Publisher<ticketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
