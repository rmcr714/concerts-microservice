import { Subjects } from '@concertmicroservice/common'
import { AbstractInternalEventHandler } from '../eventHandler'
import { InternalEventsModel, InternalEventsDoc } from '../../models/events'
import { OrderCreatedPublisher } from './order-created-publisher'
import { OrderCancelledPublisher } from './order-cancelled-publisher'
import { natsWrapper } from '../../nats-wrapper'

export class OrderEventHandler extends AbstractInternalEventHandler<
  InternalEventsModel,
  InternalEventsDoc
> {
  selectPublisher(subject: Subjects) {
    switch (subject) {
      case Subjects.OrderCreated:
        return new OrderCreatedPublisher(natsWrapper.client)
      case Subjects.OrderCancelled:
        return new OrderCancelledPublisher(natsWrapper.client)
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
