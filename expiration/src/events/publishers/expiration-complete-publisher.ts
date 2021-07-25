import { ExpirationCompleteEvent, Publisher, Subjects } from "@banana.inc/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}