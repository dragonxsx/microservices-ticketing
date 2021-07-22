import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@banana.inc/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.id);

        if(!ticket) {
            throw new NotFoundError();
        }

        const {title, price} = data;
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }
}