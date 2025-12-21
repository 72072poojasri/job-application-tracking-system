const Queue = require("bull");
const emailQueue = new Queue("emailQueue");

module.exports = emailQueue;
