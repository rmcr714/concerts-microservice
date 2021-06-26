import nats, { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    protected client: Stan;
    protected ackWait: number;
    abstract onMessage(data: T['data'], msg: Message): void;
    constructor(client: Stan);
    subscriptionsOptions(): nats.SubscriptionOptions;
    listen(): void;
    parseMessage(msg: Message): any;
}
export {};
