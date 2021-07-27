import { ExpirationCompleteEvent, OrderStatus } from "@banana.inc/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 34
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdasfdvv',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    const data : ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return { listener, ticket, order, data, msg };
};

it('does not update the completed order', async () => {
    const {listener, order, data, msg} = await setup();

    order.set({status: OrderStatus.Complete});
    await order.save();

    await listener.onMessage(data, msg as Message);

    const dbOrder = await Order.findById(order.id);
    expect(dbOrder!.version).toEqual(order.version);
    expect(dbOrder!.status).toEqual(OrderStatus.Complete);
})

it('updates the order status to cancelled', async () => {
    const {listener, order, data, msg} = await setup();

    await listener.onMessage(data, msg as Message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
    const {listener, order, data, msg} = await setup();

    await listener.onMessage(data, msg as Message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});