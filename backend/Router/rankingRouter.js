const express = require('express');
const router = express.Router();
const User = require('../Model/User');

/**
 * GET /
 * Return all users sorted by number of tests taken (desc).
 * Response: { success: true, data: [ { name, email, testsTakenCount, testsTaken, rank } ] }
 */
router.get('/', async (req, res) => {
  try {
    // fetch only the fields we need
    const users = await User.find({}, 'name email testsTaken').lean();

    // map and compute testsTakenCount
    const mapped = users.map(u => ({
      name: u.name,
      email: u.email,
      testsTaken: Array.isArray(u.testsTaken) ? u.testsTaken : [],
      testsTakenCount: Array.isArray(u.testsTaken) ? u.testsTaken.length : 0,
    }));

    // sort by testsTakenCount desc
    mapped.sort((a, b) => b.testsTakenCount - a.testsTakenCount);

    // add rank (1-based). Users with equal counts get sequential ranks (no ties handling needed now)
    const ranked = mapped.map((u, idx) => ({ ...u, rank: idx + 1 }));

    return res.json({ success: true, data: ranked });
  } catch (err) {
    console.error('Error in /v1/ranking:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
