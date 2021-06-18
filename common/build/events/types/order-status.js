"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    //when the order is created,but the ticket it is trying
    //to order is not reserved
    OrderStatus["Created"] = "created";
    //The ticket the order is trying to reserve is already been reserved or when the user has cancelled the order
    //the order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    //The order has  successfully reserved the ticket
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    //The order has reserved the ticket and the user
    //has completed the payment successfully
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
