import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { stripe } from '../stripe'
import {
  requireAuth,
  validateRequest,
  BadErrorRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@concertmicroservice/common'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadErrorRequest('Cannot pay for a cancelled order')
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadErrorRequest('Cannot pay twice for the same order')
    }

    const charge = await stripe.charges.create({
      currency: 'inr',
      amount: order.price * 100,
      source: token,
    })

    const payment = Payment.build({ orderId, stripeId: charge.id })
    await payment.save()

    order.set({ status: OrderStatus.Complete })
    await order.save()

    console.log(payment)

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    })

    res.status(201).send({ success: true, id: payment.id })
  }
)

export { router as createChargeRouter }
