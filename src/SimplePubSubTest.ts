import { Emitter, EventHandler, MessageQueue } from "./SimplePubSub";

const messageQ = new MessageQueue();

const clickEmitter = new Emitter(messageQ);
const resizeEmitter = new Emitter(messageQ);

const clickSubscriber1 = new EventHandler("click", (data: any) => {
    console.log("clickSubscriber1:: ", data);
});
const clickSubscriber2 = new EventHandler("click", (data: any) => {
    console.log("clickSubscriber2:: ", data);
});
const resizeSubscriber = new EventHandler("resize", (data: any) => {
    console.log("resizeSubscriber:: ", data);
});

messageQ.subscribe(clickSubscriber1);
messageQ.subscribe(clickSubscriber2);
messageQ.subscribe(resizeSubscriber);

clickEmitter.publish({
    topic: "click",
    data: {
        target: "Div",
    },
});
resizeEmitter.publish({
    topic: "resize",
    data: {
        target: "Button",
    },
});

clickEmitter.publish({
    topic: "click",
    data: {
        target: "Main",
    },
});
