export enum OrderStatus {
  /** Order created but the ticket it is trying to associate with hasn't been reserved yet */
  Created = 'created',
  /** Ticket the order is trying to reserve has already been reserved, or user has cancelled the order */
  Cancelled = 'cancelled',
  /** Order is successfully reserved, waiting for payment */
  AwaitingPayment = 'awaiting:payment',
  /** Order was successfully reserver and paid for */
  Complete = 'complete',
}
