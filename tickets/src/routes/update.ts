import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  DatabaseConnectionError,
  Subjects,
  BadErrorRequest,
} from '@concertmicroservice/common'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'
import mongoose from 'mongoose' //
import { UserEvent } from '../models/events' //
import InternalEventEmitter from '../events/internalEventEmitter' //

const router = express.Router()

router.put(
  '/api/tickets/:id',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greatet than 0 '),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.orderId) {
      throw new BadErrorRequest('Cannot edit a reserved ticket')
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    const SESSION = await mongoose.startSession()
    try {
      await SESSION.startTransaction()
      ticket.set({ ...req.body })
      await ticket.save()

      const event = UserEvent.build({
        //
        name: Subjects.TicketUpdated, //
        data: {
          //
          id: ticket.id, //
          title: ticket.title, //
          price: ticket.price, //
          userId: ticket.userId, //
          version: ticket.version,
        },
      })

      await event.save() //

      // new TicketUpdatedPublisher(natsWrapper.client).publish({
      //   id: ticket.id,
      //   title: ticket.title,
      //   price: ticket.price,
      //   userId: ticket.userId,
      // })
      await SESSION.commitTransaction() //
      res.send(ticket)
      InternalEventEmitter.emitNatsEvent()
    } catch (err) {
      await SESSION.abortTransaction() //
      throw new DatabaseConnectionError()
    } finally {
      //
      // FINALIZE SESSION
      SESSION.endSession() //
    }
  }
)

export { router as updateTicketRouter }
