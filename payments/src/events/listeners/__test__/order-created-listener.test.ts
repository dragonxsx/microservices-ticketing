import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@banana.inc/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'adasdasdsa',
        userId: 'nnjfns',
        status: OrderStatus.Created,
        ticket: {
            id: 'adafkadf',
            price: 45
        }
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('replicates the order info', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg as Message);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});