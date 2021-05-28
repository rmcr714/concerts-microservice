import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
// import { RequestValidationError } from '../errors/request-validation-error'
import { validateRequest } from '../middlewares/validate-requests'
import { User } from '../models/user'
import { BadErrorRequest } from '../errors/bad-request-error'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // const errors = validationResult(req)

    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array())
    // }

    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadErrorRequest('Invalid credentials')
    }
    console.log(existingUser)

    const passwordMatch = await Password.compare(
      existingUser.password.toString(),
      password
    )

    if (!password) {
      throw new BadErrorRequest('Invalid Credentials')
    }

    //create json web token
    const userJwt = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_KEY!
    )
    //store it on session object
    req.session = {
      jwt: userJwt,
    }
    res.status(200).send(existingUser)
  }
)

export { router as signinRouter }
