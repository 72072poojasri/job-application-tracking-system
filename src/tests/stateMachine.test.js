const { isValidTransition } = require("../services/stateMachine.service");

describe("Application State Machine", () => {
  test("Valid transition", () => {
    expect(isValidTransition("Applied", "Screening")).toBe(true);
  });

  test("Invalid transition", () => {
    expect(isValidTransition("Applied", "Offer")).toBe(false);
  });
});
