import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@concertmicroservice/common'
import { Ticket } from '../models/ticket'

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
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    })

    await ticket.save()
    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
