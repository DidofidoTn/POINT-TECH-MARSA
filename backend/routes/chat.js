const express = require('express');
const router = express.Router();
const { auth } = require('./auth');

const messages = {};

router.post('/send', auth, (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message vide' });
    }

    const msgId = Date.now().toString();
    messages[msgId] = {
      id: msgId,
      userId: req.userId,
      message,
      sender: 'user',
      isRead: false,
      createdAt: new Date()
    };

    res.json({
      success: true,
      message: 'Message envoyé',
      chatMessage: messages[msgId]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/history', auth, (req, res) => {
  try {
    const userMessages = Object.values(messages)
      .filter(m => m.userId === req.userId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-50);

    res.json({ success: true, messages: userMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/read', auth, (req, res) => {
  try {
    Object.values(messages).forEach(m => {
      if (m.userId === req.userId && !m.isRead && m.sender === 'support') {
        m.isRead = true;
      }
    });

    res.json({ success: true, message: 'Messages marqués comme lus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
