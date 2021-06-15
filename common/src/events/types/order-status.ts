export enum OrderStatus {
  //when the order is created,but the ticket it is trying
  //to order is not reserved
  Created = 'created',

  //The ticket the order is trying to reserve is already been reserved or when the user has cancelled the order
  //the order expires before payment
  Cancelled = 'cancelled',

  //The order has  successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  //The order has reserved the ticket and the user
  //has completed the payment successfully
  Complete = 'complete',
}
