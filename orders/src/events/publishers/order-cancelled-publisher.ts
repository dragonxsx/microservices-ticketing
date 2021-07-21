import { OrderCancelledEvent, Publisher, Subjects } from "@banana.inc/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}