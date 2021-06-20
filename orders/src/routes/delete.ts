import {
  DatabaseConnectionError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  Subjects,
} from '@concertmicroservice/common'
import express, { Request, Response } from 'express'
import { OrderStatus } from '@concertmicroservice/common'
import { Order } from '../models/order'
import mongoose from 'mongoose'
import { OrderEvent } from '../models/events'
import InternalEventEmitter from '../events/internalEventEmitter'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    const SESSION = await mongoose.startSession() //
    try {
      await SESSION.startTransaction() //
      order.status = OrderStatus.Cancelled

      await order.save()

      const event = OrderEvent.build({
        //
        name: Subjects.OrderCancelled, //
        data: {
          //
          id: order.id, //
          ticket: {
            id: order.ticket.id,
          },
        },
      })

      await event.save() //
      await SESSION.commitTransaction() //
      res.status(204).send(order)
      InternalEventEmitter.emitNatsEvent()
    } catch (err) {
      await SESSION.abortTransaction() //
      throw new DatabaseConnectionError() //
    } finally {
      //
      // FINALIZE SESSION
      SESSION.endSession() //
    }
  }
)

export { router as deleteOrderRouter }
