import mongoose from 'mongoose'
import { Order } from './order'
import { OrderStatus } from '@concertmicroservice/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number //same for achieving the optimsitic concurrency control
  isReserved(): Promise<boolean> //assigning a method to a document
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  // findByEvent(event:{id:string,version:number}):Promise<TicketDoc|null>
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin) //for achieving the optimistic concurrency control using version

//add a method to ticket model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price })
}

//add a method on ticket document
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    //@ts-ignore
    ticket: this, //this represents the current ticket
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
