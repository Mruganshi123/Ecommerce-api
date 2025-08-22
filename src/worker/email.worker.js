const { Worker } = require("bullmq");
const redis = require('../config/redis');
const { sendEmail } = require('../features/email/email.service');


const emailWorker = new Worker(
    'email-queue',
    async (job) => {
        console.log('[WORKER] Picked up job:', job.name, job.data);
        const { to, subject, type, payload } = job.data;
        await sendEmail({ to, subject, type, payload });
    },
    {
        connection: redis
    }
);


emailWorker.on("completed", (job) => {
    console.log(`✅ Email sent to ${job.data.to}`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`❌ Email failed: ${err.message}`);
});
