const express = require('express');
const { authenticate } = require('../middleware/auth');
const { sendSupportTicketNotification, sendSupportTicketReply } = require('../utils/emailService');

const router = express.Router();

// In-memory ticket store (replace with MongoDB model for production persistence)
let tickets = [];
let ticketCounter = 1000;

const generateTicketId = () => {
  ticketCounter++;
  return `TKT-${String(ticketCounter).padStart(5, '0')}`;
};

// ─────────────────────────────────────────────
// @route   POST /api/support/tickets
// @desc    Create a new support ticket
// ─────────────────────────────────────────────
router.post('/tickets', authenticate, async (req, res) => {
  try {
    const { subject, message, priority } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required.' });
    }

    const ticketId = generateTicketId();
    const ticket = {
      id: ticketId,
      subject,
      message,
      priority: priority || 'Normal',
      status: 'Open',
      userName: req.user.name,
      userEmail: req.user.email,
      userId: req.user._id.toString(),
      createdAt: new Date().toISOString(),
      replies: []
    };

    tickets.push(ticket);

    // Send email notifications
    await sendSupportTicketNotification({
      ticketId,
      subject,
      message,
      userName: req.user.name,
      userEmail: req.user.email,
      priority: priority || 'Normal'
    });

    res.status(201).json({
      success: true,
      ticket,
      message: `Support ticket #${ticketId} created. We'll respond within 24 hours.`
    });

  } catch (error) {
    console.error('Create support ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/support/tickets
// @desc    Get all support tickets (SuperAdmin sees all, others see their own)
// ─────────────────────────────────────────────
router.get('/tickets', authenticate, async (req, res) => {
  try {
    const isSuperAdmin = req.user.role && req.user.role.name === 'Super Admin';
    const filtered = isSuperAdmin
      ? tickets
      : tickets.filter(t => t.userId === req.user._id.toString());

    res.json(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// @route   POST /api/support/tickets/:id/reply
// @desc    SuperAdmin replies to a ticket – sends email to user
// ─────────────────────────────────────────────
router.post('/tickets/:id/reply', authenticate, async (req, res) => {
  try {
    const isSuperAdmin = req.user.role && req.user.role.name === 'Super Admin';
    if (!isSuperAdmin) {
      return res.status(403).json({ message: 'Only Super Admin can reply to tickets.' });
    }

    const { replyMessage } = req.body;
    if (!replyMessage) {
      return res.status(400).json({ message: 'Reply message is required.' });
    }

    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found.' });
    }

    const reply = {
      message: replyMessage,
      by: req.user.name,
      at: new Date().toISOString()
    };
    ticket.replies.push(reply);
    ticket.status = 'Replied';

    // Send email reply to the user
    await sendSupportTicketReply({
      ticketId: ticket.id,
      ticketSubject: ticket.subject,
      replyMessage,
      userName: ticket.userName,
      userEmail: ticket.userEmail
    });

    res.json({ success: true, ticket });

  } catch (error) {
    console.error('Reply support ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// @route   PUT /api/support/tickets/:id/status
// @desc    Update ticket status
// ─────────────────────────────────────────────
router.put('/tickets/:id/status', authenticate, async (req, res) => {
  try {
    const isSuperAdmin = req.user.role && req.user.role.name === 'Super Admin';
    if (!isSuperAdmin) {
      return res.status(403).json({ message: 'Only Super Admin can update ticket status.' });
    }

    const { status } = req.body;
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found.' });
    }

    ticket.status = status;
    res.json({ success: true, ticket });

  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
