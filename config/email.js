// config/email.js
// This file is used by BOTH local server and Vercel function
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Create email transporter based on environment
 */
const createTransporter = () => {
  // For local development with .env
  if (process.env.NODE_ENV !== 'production') {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // For Vercel (uses environment variables from Vercel dashboard)
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send email function - SHARED logic
 */
const sendEmail = async ({ name, email, message }) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Portfolio Contact'}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
    subject: `New Portfolio Message from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #38bdf8; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #38bdf8; margin-bottom: 5px; }
          .value { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .footer { margin-top: 30px; text-align: center; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✨ New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">💬 Message</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Sent from your portfolio website • <a href="https://arghadeep.dev">arghadeep.dev</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      New Portfolio Message
      
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
    replyTo: email
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };