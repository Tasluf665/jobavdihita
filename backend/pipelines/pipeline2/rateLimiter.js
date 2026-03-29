const sleep = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

const waitForNextRequest = async (delayMs = 1200) => {
    const safeDelay = Number.isFinite(Number(delayMs)) ? Number(delayMs) : 1200;
    if (safeDelay <= 0) {
        return;
    }

    await sleep(safeDelay);
};

module.exports = {
    waitForNextRequest,
};

