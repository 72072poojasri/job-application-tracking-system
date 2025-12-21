const workflow = {
  Applied: ["Screening", "Rejected"],
  Screening: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],
  Hired: [],
  Rejected: []
};

function isValidTransition(from, to) {
  return workflow[from]?.includes(to);
}

module.exports = { isValidTransition };
