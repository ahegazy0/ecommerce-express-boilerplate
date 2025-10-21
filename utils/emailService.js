// email.service.js
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const { GOOGLE_USER, GMAIL_APP_PASSWORD, FRONTEND_BASE_URL, APP_NAME } =
  process.env;

class EmailService {
  constructor() {
    // Create transporter once in constructor (FIXED)
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: GOOGLE_USER,
        pass: GMAIL_APP_PASSWORD,
      },
      // Additional timeout settings for Render
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });
  }

  generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  async sendVerificationEmail(email, token, name) {
    try {
      const verificationUrl = `${FRONTEND_BASE_URL}/auth/verify-email?token=${token}`;

      const mailOptions = {
        from: `"${APP_NAME || "E-Commerce"}" <${GOOGLE_USER}>`,
        to: email,
        subject: "Email Verification - E-Commerce",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Welcome to E-Commerce!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async sendPasswordResetEmail(email, token, name) {
    try {
      const resetUrl = `${FRONTEND_BASE_URL}/auth/reset-password?token=${token}`;

      const mailOptions = {
        from: `"${APP_NAME || "E-Commerce"}" <${GOOGLE_USER}>`,
        to: email,
        subject: "Password Reset - E-Commerce",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to reset it.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p style="color: #dc3545; font-weight: bold;">If you didn't request this password reset, ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: `"${APP_NAME || "E-Commerce"}" <${GOOGLE_USER}>`,
        to: email,
        subject: "Welcome to E-Commerce!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745; text-align: center;">Welcome to E-Commerce!</h2>
            <p>Hi ${name},</p>
            <p>Your email has been successfully verified! Welcome to our platform.</p>
            <p>You can now enjoy all the features of our e-commerce platform:</p>
            <ul>
              <li>Browse and search products</li>
              <li>Add items to your cart</li>
              <li>Place orders</li>
              <li>Leave reviews</li>
              <li>Manage your profile</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${FRONTEND_BASE_URL}/products" 
                style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Start Shopping
              </a>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }
  }
}

module.exports = new EmailService();
