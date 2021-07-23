import { TicketCreatedEvent } from "@banana.inc/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
    // create an instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data : TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return {listener, data, msg};
}

it('creates and save a ticket', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg as Message);

    // write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price); 
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg as Message);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});