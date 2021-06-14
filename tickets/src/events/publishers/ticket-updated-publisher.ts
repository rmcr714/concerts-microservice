import { Publisher, Subjects, TicketUpdated } from '@concertmicroservice/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdated> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
