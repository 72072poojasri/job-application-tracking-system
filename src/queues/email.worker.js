emailQueue.process(async (job) => {
  const { to, subject } = job.data;
  console.log(`Email sent to ${to}: ${subject}`);
});
