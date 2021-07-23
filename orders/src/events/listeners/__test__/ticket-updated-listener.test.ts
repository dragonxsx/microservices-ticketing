import { TicketUpdatedEvent } from "@banana.inc/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 865,
        userId: mongoose.Types.ObjectId().toHexString()
    };

    // Create a fake msg object
    const msg: Partial<Message> = {
        ack: jest.fn()
    }

    // return all of this stuff
    return { msg, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
    const {msg, data, ticket, listener} = await setup();

    await listener.onMessage(data, msg as Message);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const {msg, data, listener} = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const {msg, data, listener, ticket} = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg as Message);
    } catch (e) {

    }

    expect(msg.ack).not.toHaveBeenCalled();
})