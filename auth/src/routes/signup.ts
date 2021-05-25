import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { User } from '../models/user'
import { RequestValidationError } from '../errors/request-validation-error'
import { BadErrorRequest } from '../errors/bad-request-error'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 to 20 character'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    const { email, password } = req.body

    //check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadErrorRequest('Email already in use')
    }

    const user = User.build({ email, password })
    await user.save()
    res.status(201).send(user)
  }
)

export { router as signupRouter }
