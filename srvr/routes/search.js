const express = require("express");
const router = express.Router();

const mockResults = [
  { id: 1, name: "Result 1" },
  { id: 2, name: "Result 2" },
  { id: 3, name: "Result 3" },
];

// Store fake payments (In real case, use a database)
const paidUsers = new Set();

router.get("/", (req, res) => {
  const userId = req.query.userId;
  const paymentSuccess = req.query.paymentSuccess === "true";

  if (paymentSuccess && userId) {
    paidUsers.add(userId); // Store the paid user
  }

  if (!userId || !paidUsers.has(userId)) {
    return res.json({ requiresPayment: true, message: "You need to pay before accessing results." });
  }

  res.json({ requiresPayment: false, results: mockResults });
});

module.exports = router;