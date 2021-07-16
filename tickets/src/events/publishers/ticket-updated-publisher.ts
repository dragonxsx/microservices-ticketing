import { Publisher, Subjects, TicketUpdatedEvent } from "@banana.inc/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}