import { Worker } from "bullmq";

const worker = new Worker("Email_MFA", async job => {
    console.log(`Proccessing the task: ${job.id}`)

    return "Email sent, redirect to verify page"
}, {
    connection: {
        host: "localhost",
        port: 6379
    }
})

worker.on('completed', job => {
    console.log(`Task is done: ${job.id}`)
})

worker.on('failed', (job, err) => {
    console.log(`Task is failed: ${job.id}, error: ${err.message}`)
})