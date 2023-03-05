export interface Observer {
    update(): void;
}

export interface Observable {
    count: number;
    map: Record<number, Observer | undefined>;

    addObserver(observer: Observer): number;
    removeObserver(id: number): void;
    notifyAll(): void;
}

export class Subject implements Observable {
    count: number = 0;
    public map: Record<number, Observer | undefined> = {};

    constructor() {}

    notifyAll(): void {
        for (const observer of Object.values(this.map)) {
            if (observer === undefined) continue;
            observer.update();
        }
    }

    addObserver(observer: Observer): number {
        this.map[++this.count] = observer;
        return this.count;
    }

    removeObserver(id: number): void {
        this.map[id] = undefined;
    }
}

export class Handler implements Observer {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    update(): void {
        console.log("Handler Observer:: ", this.name);
    }
}

const subject = new Subject();
const handler1 = new Handler("1");
const handler2 = new Handler("2");

subject.addObserver(handler1);
subject.addObserver(handler2);

subject.notifyAll();
