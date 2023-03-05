export type TMessage = {
    topic: string;
    data: Record<string, any>;
};

// observable
export interface PubSubBroker {
    count: number;
    topics: Record<string, Record<number, Subscriber>>;

    subscribe(subscriber: Subscriber): number; // add
    unsubscribe(topic: string, subscriberId: number): void; // delete

    publish(message: TMessage): void; // notify all
}

// observer
export interface Subscriber {
    topic: string;
    onSubscribe(data: Record<string, any>): void; // run logic
}

export abstract class Publisher {
    broker: PubSubBroker;
    constructor(broker: PubSubBroker) {
        this.broker = broker;
    }
    public abstract publish(message: TMessage): void;
}

export class MessageQueue implements PubSubBroker {
    count: number = 0;
    topics: Record<string, Record<number, Subscriber>> = {};

    subscribe(subscriber: Subscriber): number {
        const topic = subscriber.topic;

        if (this.topics[topic] === undefined) {
            this.topics[topic] = {};
        }

        console.log("MessageQueue subscribed ", {
            count: this.count,
            topic,
            subscriber,
        });

        this.topics[topic][++this.count] = subscriber;
        return this.count;
    }

    unsubscribe(topic: string, subscriberId: number): void {
        if (this.topics[topic]) {
            throw new Error(`Subscribers subscribing ${topic} does not exist!`);
        }

        delete this.topics[topic][subscriberId];
    }

    publish(message: TMessage): void {
        const { topic, data } = message;
        const subscriberMap = this.topics[topic];
        if (!subscriberMap) {
            throw new Error(`Subscribers subscribing ${topic} does not exist!`);
        }

        const subscribers = Object.values(subscriberMap);
        subscribers.forEach((s) => {
            s.onSubscribe(data);
        });
    }
}

export class Emitter extends Publisher {
    constructor(broker: PubSubBroker) {
        super(broker);
    }

    publish(message: TMessage): void {
        console.log("Emitter published:: ", message);
        this.broker.publish(message);
    }
}

export class EventHandler implements Subscriber {
    constructor(public topic: string, public cb: Function) {}

    onSubscribe(data: Record<string, any>): void {
        console.log("EventHandler onSubscribe:: ", {
            topic: this.topic,
            data,
        });
        this.cb(data);
    }
}
