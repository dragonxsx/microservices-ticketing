import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@banana.inc/common';
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'asdasddf',
        version: 0
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'asdasfdfdf'
        }
    };

    const msg: Partial<Message> = {
        ack: jest.fn()
    };

    return { listener, data, msg , order};
}

it('updates the status of the order', async () => {
    const {listener, data, msg, order} = await setup();

    await listener.onMessage(data, msg as Message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const {listener, data, msg, order} = await setup();

    await listener.onMessage(data, msg as Message);

    expect(msg.ack).toHaveBeenCalled();
});