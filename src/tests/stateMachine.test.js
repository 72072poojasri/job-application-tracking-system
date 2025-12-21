const { validateTransition } = require("../services/stateMachine.service");

describe("Application Workflow State Machine", () => {

  test("Applied → Screening is allowed", () => {
    expect(validateTransition("Applied", "Screening")).toBe(true);
  });

  test("Applied → Interview is NOT allowed", () => {
    expect(validateTransition("Applied", "Interview")).toBe(false);
  });

  test("Interview → Offer is allowed", () => {
    expect(validateTransition("Interview", "Offer")).toBe(true);
  });

  test("Offer → Hired is allowed", () => {
    expect(validateTransition("Offer", "Hired")).toBe(true);
  });

  test("Hired → Rejected is NOT allowed", () => {
    expect(validateTransition("Hired", "Rejected")).toBe(false);
  });

});
