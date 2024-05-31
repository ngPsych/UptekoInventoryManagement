// This timer is used to performance test, render time.

const timers = {};

export const startTimer = (label) => {
    timers[label] = performance.now();
};

export const endTimer = (label) => {
    const endTime = performance.now();
    const duration = endTime - timers[label];
    console.log(`${label} took ${duration.toFixed(2)} ms`);
    delete timers[label];
};
