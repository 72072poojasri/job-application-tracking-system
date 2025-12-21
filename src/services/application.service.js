const { validateTransition } = require("./stateMachine.service");

if (!validateTransition(application.stage, newStage)) {
  throw new Error(
    `Invalid transition from ${application.stage} to ${newStage}`
  );
}
