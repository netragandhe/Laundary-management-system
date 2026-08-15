const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────
//  SMTP Transporter Configuration (Brevo)
// ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // STARTTLS on port 587
  auth: {
    user: process.env.EMAIL_USER,   // your Brevo account email
    pass: process.env.EMAIL_PASS    // Brevo SMTP API key (xkeysib-...)
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ─────────────────────────────────────────────
//  Email Addresses
// ─────────────────────────────────────────────
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'info@kiaantechnology.com';
const SUPPORT_EMAIL    = process.env.SUPPORT_EMAIL    || 'support@kiaantechnology.com';
const FROM_NAME        = 'Kiaan Technology – Laundry SaaS';

// ─────────────────────────────────────────────
//  Core send helper
// ─────────────────────────────────────────────
const sendEmail = async ({ to, subject, html, from }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[EmailService] EMAIL_USER / EMAIL_PASS not set. Skipping email.');
      return;
    }
    const info = await transporter.sendMail({
      from: from || `"${FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[EmailService] Email sent → ${to} | MsgId: ${info.messageId}`);
  } catch (err) {
    console.error('[EmailService] Failed to send email:', err.message);
  }
};

// ─────────────────────────────────────────────
//  Common Header / Footer HTML
// ─────────────────────────────────────────────
const emailHeader = (title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <!-- Header Banner -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">🧺 Kiaan Technology</h1>
            <p style="margin:6px 0 0;color:#a8b8d8;font-size:13px;">Laundry Management SaaS Platform</p>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
`;

const emailFooter = () => `
        </td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8faff;padding:20px 40px;border-top:1px solid #e8ecf4;text-align:center;">
            <p style="margin:0;color:#8898aa;font-size:12px;">
              © 2026 Kiaan Technology Private Limited &nbsp;|&nbsp; 
              <a href="https://kiaantechnology.com" style="color:#4a6cf7;text-decoration:none;">kiaantechnology.com</a>
            </p>
            <p style="margin:6px 0 0;color:#aab4c4;font-size:11px;">
              This is an automated message. For help, contact 
              <a href="mailto:support@kiaantechnology.com" style="color:#4a6cf7;text-decoration:none;">support@kiaantechnology.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

// ─────────────────────────────────────────────
//  1. Welcome Email → New Admin/Staff
// ─────────────────────────────────────────────
const sendWelcomeEmail = async ({ name, email, username, password, role, branch }) => {
  const subject = '🎉 Welcome to Kiaan Laundry SaaS – Your Account is Ready!';
  const html = emailHeader('Welcome to Kiaan Laundry SaaS') + `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px;">Welcome, ${name}! 👋</h2>
    <p style="color:#5a6779;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Your account has been created on the <strong>Kiaan Laundry Management SaaS Platform</strong>. 
      Below are your login credentials. Please keep them safe and change your password after first login.
    </p>

    <!-- Credentials Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;border-radius:10px;border:1px solid #dce4ff;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <h3 style="margin:0 0 16px;color:#4a6cf7;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">🔐 Your Login Credentials</h3>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:5px 0;width:130px;">Portal URL</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">
              <a href="https://laundarys.netlify.app" style="color:#4a6cf7;text-decoration:none;">laundarys.netlify.app</a>
            </td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:5px 0;">Username</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${username}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:5px 0;">Email</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${email}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:5px 0;">Password</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;font-family:monospace;background:#fff;padding:3px 8px;border-radius:4px;border:1px solid #dce4ff;">${password}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:5px 0;">Role</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${role || 'Staff'}</td>
          </tr>
          ${branch ? `<tr>
            <td style="color:#8898aa;font-size:13px;padding:5px 0;">Branch</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${branch}</td>
          </tr>` : ''}
        </table>
      </td></tr>
    </table>

    <div style="background:#fff8e1;border-left:4px solid #ffc107;padding:14px 18px;border-radius:6px;margin-bottom:24px;">
      <p style="margin:0;color:#7a6200;font-size:13px;">
        ⚠️ <strong>Security Note:</strong> Please change your password immediately after your first login. 
        Do not share your credentials with anyone.
      </p>
    </div>

    <p style="color:#8898aa;font-size:13px;margin:0;">
      If you face any issues logging in, contact your admin or reach us at 
      <a href="mailto:support@kiaantechnology.com" style="color:#4a6cf7;">support@kiaantechnology.com</a>
    </p>
  ` + emailFooter();

  await sendEmail({ to: email, subject, html });
};

// ─────────────────────────────────────────────
//  2. Plan Purchase Notification → SuperAdmin
// ─────────────────────────────────────────────
const sendPlanPurchaseNotification = async ({ adminName, adminEmail, planName, planAmount, planExpiry, branchName }) => {
  const subject = `💳 New Plan Purchased – ${adminName} (${planName})`;
  const html = emailHeader('Plan Purchase Notification') + `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px;">New Plan Purchased! 🎉</h2>
    <p style="color:#5a6779;font-size:15px;line-height:1.7;margin:0 0 24px;">
      An admin has successfully purchased a subscription plan.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9f0;border-radius:10px;border:1px solid #c8eac8;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <h3 style="margin:0 0 16px;color:#28a745;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">📋 Plan Details</h3>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;width:160px;">Admin Name</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${adminName}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Admin Email</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${adminEmail}</td>
          </tr>
          ${branchName ? `<tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Branch</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${branchName}</td>
          </tr>` : ''}
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Plan Name</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${planName}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Amount Paid</td>
            <td style="color:#28a745;font-size:16px;font-weight:700;">₹${planAmount}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Plan Expiry</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${planExpiry}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Purchase Date</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="color:#8898aa;font-size:13px;margin:0;">
      Login to the SuperAdmin panel to manage this subscription and monitor usage.
    </p>
  ` + emailFooter();

  await sendEmail({ to: SUPERADMIN_EMAIL, subject, html });
};

// ─────────────────────────────────────────────
//  3. Plan Expiry Warning → Admin
// ─────────────────────────────────────────────
const sendPlanExpiryWarning = async ({ adminName, adminEmail, planName, expiryDate, daysLeft }) => {
  const isExpired = daysLeft <= 0;
  const subject = isExpired
    ? `🚨 Your Plan Has Expired – ${planName}`
    : `⚠️ Plan Expiring Soon – ${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left`;

  const html = emailHeader('Plan Expiry Notice') + `
    <h2 style="color:${isExpired ? '#dc3545' : '#e67e22'};font-size:22px;margin:0 0 8px;">
      ${isExpired ? '🚨 Plan Expired!' : '⚠️ Plan Expiring Soon!'}
    </h2>
    <p style="color:#5a6779;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Dear <strong>${adminName}</strong>, ${isExpired
        ? 'your subscription plan has <strong>expired</strong>. Your access to premium features may be restricted.'
        : `your subscription plan will expire in <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong>. Please renew to avoid service interruption.`}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f5;border-radius:10px;border:1px solid #ffd4d4;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <h3 style="margin:0 0 16px;color:#dc3545;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">📋 Subscription Details</h3>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;width:140px;">Plan Name</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${planName}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Expiry Date</td>
            <td style="color:#dc3545;font-size:13px;font-weight:600;">${expiryDate}</td>
          </tr>
          ${!isExpired ? `<tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Days Remaining</td>
            <td style="color:#e67e22;font-size:16px;font-weight:700;">${daysLeft} day${daysLeft === 1 ? '' : 's'}</td>
          </tr>` : ''}
        </table>
      </td></tr>
    </table>

    <!-- Upgrade CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="https://laundarys.netlify.app/plans" 
           style="display:inline-block;background:linear-gradient(135deg,#4a6cf7,#6a3de8);color:#ffffff;font-size:15px;font-weight:600;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
          🚀 Upgrade / Renew Plan Now
        </a>
      </td></tr>
    </table>

    <p style="color:#8898aa;font-size:13px;margin:0;">
      Need help? Contact us at 
      <a href="mailto:support@kiaantechnology.com" style="color:#4a6cf7;">support@kiaantechnology.com</a>
    </p>
  ` + emailFooter();

  await sendEmail({ to: adminEmail, subject, html });
  // Also notify superadmin
  await sendEmail({
    to: SUPERADMIN_EMAIL,
    subject: `[SuperAdmin Alert] ${subject} – Admin: ${adminName} (${adminEmail})`,
    html
  });
};

// ─────────────────────────────────────────────
//  4. Payment Notification → SuperAdmin
// ─────────────────────────────────────────────
const sendPaymentNotification = async ({ adminName, adminEmail, branchName, orderNumber, amount, method, status }) => {
  const subject = `💰 Payment ${status} – ₹${amount} from ${adminName}`;
  const html = emailHeader('Payment Notification') + `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px;">Payment ${status} 💰</h2>
    <p style="color:#5a6779;font-size:15px;line-height:1.7;margin:0 0 24px;">
      A payment transaction has been recorded on the platform.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-radius:10px;border:1px solid #c8e0ff;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <h3 style="margin:0 0 16px;color:#4a6cf7;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">💳 Payment Details</h3>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;width:150px;">Admin / Branch</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${adminName} ${branchName ? `(${branchName})` : ''}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Admin Email</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${adminEmail}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Order / Ref No.</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${orderNumber}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Amount</td>
            <td style="color:#28a745;font-size:18px;font-weight:700;">₹${amount}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Method</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${method}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Status</td>
            <td style="color:${status === 'Paid' ? '#28a745' : '#e67e22'};font-size:13px;font-weight:600;">${status}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Date & Time</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        </table>
      </td></tr>
    </table>
  ` + emailFooter();

  await sendEmail({ to: SUPERADMIN_EMAIL, subject, html });
};

// ─────────────────────────────────────────────
//  5. Support Ticket Created → Support Email + User
// ─────────────────────────────────────────────
const sendSupportTicketNotification = async ({ ticketId, subject: ticketSubject, message, userName, userEmail, priority }) => {
  const subject = `🎫 Support Ticket #${ticketId} – ${ticketSubject}`;

  // To support team
  const htmlForSupport = emailHeader('New Support Ticket') + `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px;">New Support Ticket Received 🎫</h2>
    <p style="color:#5a6779;font-size:15px;line-height:1.7;margin:0 0 24px;">
      A new support ticket has been submitted and requires your attention.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f0ff;border-radius:10px;border:1px solid #e4c8ff;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <h3 style="margin:0 0 16px;color:#8b5cf6;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">🔖 Ticket Information</h3>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;width:140px;">Ticket ID</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">#${ticketId}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Submitted By</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${userName}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">User Email</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${userEmail}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Subject</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${ticketSubject}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Priority</td>
            <td style="color:${priority === 'High' ? '#dc3545' : priority === 'Medium' ? '#e67e22' : '#28a745'};font-size:13px;font-weight:600;">${priority || 'Normal'}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Date</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <div style="background:#f8f8f8;border-radius:8px;border:1px solid #e0e0e0;padding:20px;margin-bottom:24px;">
      <h4 style="margin:0 0 10px;color:#5a6779;font-size:13px;text-transform:uppercase;">Message</h4>
      <p style="margin:0;color:#1a1a2e;font-size:14px;line-height:1.7;">${message}</p>
    </div>

    <p style="color:#8898aa;font-size:13px;">
      Please respond to the user at <a href="mailto:${userEmail}" style="color:#4a6cf7;">${userEmail}</a> within 24 hours.
    </p>
  ` + emailFooter();

  await sendEmail({ to: SUPPORT_EMAIL, subject, html: htmlForSupport });

  // Acknowledgement to the user
  const htmlForUser = emailHeader('Support Ticket Received') + `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px;">We've Received Your Ticket! ✅</h2>
    <p style="color:#5a6779;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Dear <strong>${userName}</strong>, thank you for reaching out. Your support ticket has been received and our team will get back to you within <strong>24 hours</strong>.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;border-radius:10px;border:1px solid #dce4ff;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;width:120px;">Ticket ID</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">#${ticketId}</td>
          </tr>
          <tr>
            <td style="color:#8898aa;font-size:13px;padding:6px 0;">Subject</td>
            <td style="color:#1a1a2e;font-size:13px;font-weight:600;">${ticketSubject}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="color:#8898aa;font-size:13px;margin:0;">
      For urgent issues, contact us directly at 
      <a href="mailto:support@kiaantechnology.com" style="color:#4a6cf7;">support@kiaantechnology.com</a>
    </p>
  ` + emailFooter();

  if (userEmail) {
    await sendEmail({ to: userEmail, subject: `✅ Ticket Received – #${ticketId}`, html: htmlForUser });
  }
};

// ─────────────────────────────────────────────
//  6. Support Ticket Reply → User
// ─────────────────────────────────────────────
const sendSupportTicketReply = async ({ ticketId, ticketSubject, replyMessage, userName, userEmail }) => {
  const subject = `💬 Reply to Your Ticket #${ticketId} – ${ticketSubject}`;
  const html = emailHeader('Support Ticket Reply') + `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px;">New Reply on Your Ticket 💬</h2>
    <p style="color:#5a6779;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Dear <strong>${userName}</strong>, our support team has replied to your ticket <strong>#${ticketId}</strong>.
    </p>

    <div style="background:#f0f4ff;border-left:4px solid #4a6cf7;border-radius:6px;padding:20px;margin-bottom:24px;">
      <h4 style="margin:0 0 10px;color:#4a6cf7;font-size:13px;text-transform:uppercase;">Support Reply</h4>
      <p style="margin:0;color:#1a1a2e;font-size:14px;line-height:1.7;">${replyMessage}</p>
    </div>

    <p style="color:#8898aa;font-size:13px;margin:0;">
      If you need further assistance, reply to this email or contact 
      <a href="mailto:support@kiaantechnology.com" style="color:#4a6cf7;">support@kiaantechnology.com</a>
    </p>
  ` + emailFooter();

  await sendEmail({ to: userEmail, subject, html });
};

// ─────────────────────────────────────────────
//  Exports
// ─────────────────────────────────────────────
module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPlanPurchaseNotification,
  sendPlanExpiryWarning,
  sendPaymentNotification,
  sendSupportTicketNotification,
  sendSupportTicketReply
};
