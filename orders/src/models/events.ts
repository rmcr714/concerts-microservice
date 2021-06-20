import mongoose from 'mongoose'
import { Subjects } from '@concertmicroservice/common'
export enum EventStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

interface InternalEventsAttrs {
  name: string
  data: {} // stores the payload of each different event
  status?: EventStatus
}

export interface InternalEventsDoc extends mongoose.Document {
  id: string
  name: string
  data: {} // stores the payload of each different event
  status: EventStatus
  createdAt: Date
  updatedAt: Date
}

export interface InternalEventsModel extends mongoose.Model<InternalEventsDoc> {
  build(attrs: InternalEventsAttrs): InternalEventsDoc
}

const internalEventsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: Object.values(Subjects),
      required: true,
    },
    data: {}, // stores the payload of each different event
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.PENDING,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

// Everything above here can be moved inside the common library
// And every service can extend the internalEventsSchema

internalEventsSchema.statics.build = (attrs: InternalEventsAttrs) => {
  return new OrderEvent(attrs)
}

const OrderEvent = mongoose.model<InternalEventsDoc, InternalEventsModel>(
  'OrderEvent',
  internalEventsSchema
)

export { OrderEvent }
