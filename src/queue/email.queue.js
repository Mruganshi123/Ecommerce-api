const { Queue } = require("bullmq");
const redis = require("../config/redis");

const emailQueue = new Queue("email-queue", {
    connection: redis
});

const addEmailToQueue = async (type, data) => {
    console.log(`[QUEUE] Adding job: ${type} for ${data.to}`);
    try {
        await emailQueue.add(type, data, {
            attempts: 3,
            backoff: { type: "exponential", delay: 1000 },
            removeOnComplete: true,
            removeOnFail: true
        });
        console.log(`[QUEUE] Job added`);
    } catch (err) {
        console.error('[QUEUE] Failed to add job:', err);
    }
}

module.exports = {
    addEmailToQueue,
    emailQueue
}