const { addEmailJob } = require("../queues/email.queue");

// after application creation
addEmailJob({
  to: candidate.email,
  subject: "Application submitted",
  body: "Your application was received"
});

// after stage change
addEmailJob({
  to: candidate.email,
  subject: "Application status updated",
  body: `New stage: ${newStage}`
});
