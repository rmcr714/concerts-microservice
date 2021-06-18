import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import {
  BadErrorRequest,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@concertmicroservice/common'
import { body } from 'express-validator'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //find the ticket that the user is trying to purchase
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    //Make sure that the ticket is not already reserved
    // ** Run a query to run against all orders and find an order where the ticket is the ticket we just found
    //and the orders status is not cancelled
    const isReserved = await ticket.isReserved() //see the tickets model for this method expln, basically we have attached this method to ticket document

    if (isReserved) {
      throw new BadErrorRequest('Ticket is already Reserved')
    }

    //Calculate an expiration date for the order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //build the order if all these check are done and sace it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    })

    await order.save()

    //publish an event saying that the order was created

    res.status(201).send(order)
  }
)

export { router as newOrderRouter }
