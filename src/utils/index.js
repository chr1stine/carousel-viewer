export function memoize(cb) {
    const cache = {}
    return [async (id) => {
        if (cache[id]) {
            return cache[id]
        } else {
            const result = await cb(id);
            cache[id] = result;
            return result;
        }
    }, () => {
        console.log('invalidate cache')
        for (const key in cache) {
            delete cache[key];
        }
    }]
}

export async function withStopwatch(cb) {
    let msPassed = 0;
    const stopwatch = setInterval(() => {
        msPassed++;
    }, 1);

    await cb();

    clearInterval(stopwatch);
    console.log(msPassed / 1000, 'seconds passed');
}

export function throttle(cb, timeout) {
    let busy = false;
    return (...args) => {
        if (busy) {
            return;
        }
        busy = true
        cb(...args);
        setTimeout(() => {
            busy = false;
            cb(...args);
        }, timeout)
    }
}