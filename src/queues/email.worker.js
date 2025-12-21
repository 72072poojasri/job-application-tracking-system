// Simulated background worker

const { getNextJob } = require("./email.queue");

setInterval(() => {
  const job = getNextJob();
  if (job) {
    console.log("📧 Sending email (async):", job);
  }
}, 3000);
