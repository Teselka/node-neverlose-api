type EventCallback = (...args: any) => any;

interface EventDefinition {
    name: string,
    callback: EventCallback
}

class Events
{
    protected callbacks: Array<EventDefinition>

    constructor() {
        this.callbacks = [];
    }
    
    protected on(name: string, callback: EventCallback) {
        this.callbacks.push({name, callback});
    }

    protected emit(name: string, ...args: any) {
        const _this: any = this;
        _this.callbacks.forEach((x: any, i: any) => {
            if (x.name == name) {
                // HACK: Something wrong here
                _this["__"+name+i] = _this.callbacks[i]!.callback;
                _this["__"+name+i](...args);
            }
        })
    }
}

export { Events };