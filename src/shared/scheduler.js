import Storage from './storage.js';

const storage = new Storage('scheduler.temp');
const handlerMap = {};

const getQueue = () => {
    let queue = storage.data.scheduler_queue;
    if (queue === undefined) {
        queue = [];
        storage.data.scheduler_queue = queue;
    }
    return queue;
};

const trigger = ({ event, data }) => {
    try {
        handlerMap[event]?.(data);
    } catch(error) {
        console.error(error);
    }
};

let checking = false;
const check = async () => {
    if (checking) return;
    checking = true;
    const queue = getQueue();
    const now = Date.now();
    let changed = false;
    while (queue.length) {
        const [ top ] = queue;
        if (top.time > now) break;
        changed = true;
        queue.splice(0, 1);
        trigger(top);
    }
    if (changed) {
        await storage.save();
    }
    checking = false;
};

export const run = (event, time, data) => {
    if (typeof time === 'object') {
        time = time.getTime();
    }
    const queue = getQueue();
    queue.push({ event, time, data });
    queue.sort((a, b) => a.time - b.time);
    storage.save();
};

export const on = (event, handler) => {
    handlerMap[event] = handler;
};

export const init = async () => {
    await storage.init();
    setInterval(check, 500);
};
