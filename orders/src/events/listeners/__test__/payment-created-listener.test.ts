import mongoose from "mongoose";
import { OrderStatus, PaymentCreatedEvent } from "@banana.inc/common";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { PaymentCreatedListener } from "../payment-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new PaymentCreatedListener(natsWrapper.client);

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

    const data: PaymentCreatedEvent['data'] = {
        id: 'asdasfc',
        orderId: order.id,
        stripeId: 'asdacce'
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return { listener, ticket, order, data, msg };
}

it('updates the order status', async () => {
    const {listener, data, msg, order} = await setup();

    await listener.onMessage(data, msg as Message);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it('acks the message', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});