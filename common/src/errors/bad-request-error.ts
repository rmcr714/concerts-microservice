import { CustomError } from './custom-error'

export class BadErrorRequest extends CustomError {
  statusCode = 400
  constructor(message: string) {
    super(message)
    //this line only becasue we are extending a built in class
    Object.setPrototypeOf(this, BadErrorRequest.prototype)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
