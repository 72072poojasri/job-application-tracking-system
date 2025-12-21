// Dummy async email queue (NO Redis required)

const emailQueue = [];

function addEmailJob(data) {
  console.log("📨 Email job added to queue", data);
  emailQueue.push(data);
}

function getNextJob() {
  return emailQueue.shift();
}

module.exports = {
  addEmailJob,
  getNextJob
};
