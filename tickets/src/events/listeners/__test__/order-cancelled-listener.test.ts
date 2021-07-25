import { OrderCancelledEvent } from "@banana.inc/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup  = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'asdasds'
    });
    ticket.set({orderId});
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg as Message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})