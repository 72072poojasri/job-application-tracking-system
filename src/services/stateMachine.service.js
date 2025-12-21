const ALLOWED_TRANSITIONS = {
  Applied: ["Screening", "Rejected"],
  Screening: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],
  Hired: [],
  Rejected: []
};

function validateTransition(currentStage, nextStage) {
  const allowed = ALLOWED_TRANSITIONS[currentStage] || [];
  return allowed.includes(nextStage);
}

module.exports = {
  validateTransition,
  ALLOWED_TRANSITIONS
};
