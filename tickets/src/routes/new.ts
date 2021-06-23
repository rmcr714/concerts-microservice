import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  DatabaseConnectionError,
  Subjects,
} from '@concertmicroservice/common'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'
import mongoose from 'mongoose' //
import { UserEvent } from '../models/events' //
import InternalEventEmitter from '../events/internalEventEmitter' //

const router = express.Router()

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0, lt: 3000 })
      .withMessage('Price must be greate then zero and less than 3000$'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const SESSION = await mongoose.startSession() //
    try {
      //
      //
      await SESSION.startTransaction() //
      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
      })

      await ticket.save()

      const event = UserEvent.build({
        //
        name: Subjects.TicketCreated, //
        data: {
          //
          id: ticket.id, //
          title: ticket.title, //
          price: ticket.price, //
          userId: ticket.userId, //
          version: ticket.version, //
        },
      })

      await event.save() //

      // await new TicketCreatedPublisher(natsWrapper.client).publish({
      //   id: ticket.id,
      //   title: ticket.title,
      //   price: ticket.price,
      //   userId: ticket.userId,
      // })//uncomment this if event emitter thing fails
      await SESSION.commitTransaction() //
      res.status(201).send(ticket)
      InternalEventEmitter.emitNatsEvent()
    } catch (err) {
      //
      //
      await SESSION.abortTransaction() //
      throw new DatabaseConnectionError() //
    } finally {
      //
      // FINALIZE SESSION
      SESSION.endSession() //
    } //
  }
)

export { router as createTicketRouter }
