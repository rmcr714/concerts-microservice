import { Subjects } from '@concertmicroservice/common'
import { AbstractInternalEventHandler } from '../eventHandler'
import { InternalEventsModel, InternalEventsDoc } from '../../models/events'
import { TicketCreatedPublisher } from './ticket-created-publisher'
import { TicketUpdatedPublisher } from './ticket-updated-publisher'
import { natsWrapper } from '../../nats-wrapper'

export class TicketEventHandler extends AbstractInternalEventHandler<
  InternalEventsModel,
  InternalEventsDoc
> {
  selectPublisher(subject: Subjects) {
    switch (subject) {
      case Subjects.TicketCreated:
        return new TicketCreatedPublisher(natsWrapper.client)
      case Subjects.TicketUpdated:
        return new TicketUpdatedPublisher(natsWrapper.client)
      //   case Subjects.UserAddressDeleted:
      //     return new UserAddressDeletedPublisher(natsWrapper.client);
      //   case Subjects.UserCreated:
      //     return new UserCreatedPublisher(natsWrapper.client);
      //   case Subjects.UserUpdated:
      //     return new UserUpdatedPublisher(natsWrapper.client);
      default:
        throw new Error('Publisher Not defined')
    }
  }
}
