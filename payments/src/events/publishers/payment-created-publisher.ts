import { PaymentCreatedEvent, Publisher, Subjects } from "@banana.inc/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}