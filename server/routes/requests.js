const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const ContactRequest = require('../models/ContactRequest');
const { protect, admin } = require('../middleware/auth');
const { sendTelegramMessage, formatRequestMessage } = require('../utils/telegram');

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10,
  message: { message: 'Too many submissions, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    const total = await ContactRequest.countDocuments(query);
    const requests = await ContactRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ requests, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', submitLimiter, async (req, res) => {
  try {
    const request = await ContactRequest.create(req.body);
    res.status(201).json(request);
    sendTelegramMessage(formatRequestMessage(request)).catch((err) => {
      console.error('Telegram notification error (request):', err.message);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const request = await ContactRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const request = await ContactRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
