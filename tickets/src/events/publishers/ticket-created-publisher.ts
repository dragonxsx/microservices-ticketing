import { Publisher, Subjects, TicketCreatedEvent } from "@banana.inc/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}