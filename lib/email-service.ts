import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  static async sendEmail(emailData: EmailData) {
    try {
      const result = await resend.emails.send({
        from: "Sirahats <noreply@sirahats.com>",
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
      });
      return result;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }

  static async sendWelcomeEmail(user: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8BC34A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Sirahats!</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome ${user.firstName}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining Sirahats! We're excited to have you as part of our community 
            of artisans and craft lovers.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            At Sirahats, we connect you with beautiful handcrafted baskets and home decor 
            made by skilled artisans across Africa. Each piece tells a story of tradition, 
            skill, and cultural heritage.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/shop" 
               style="background-color: #8BC34A; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; 
                      font-weight: bold;">
              Start Shopping
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Here's what you can do with your account:
          </p>
          <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <li>Browse our curated collection of handcrafted items</li>
            <li>Save your favorite products to your wishlist</li>
            <li>Track your orders and delivery status</li>
            <li>Get exclusive offers and updates</li>
          </ul>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Sirahats. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: "Welcome to Sirahats! 🎉",
      html,
    });
  }

  static async sendOrderConfirmationEmail(order: any, user: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8BC34A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order, ${
            user.firstName
          }!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your order has been confirmed and is being processed. Here are your order details:
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Order #${
              order.orderNumber
            }</h3>
            <p style="color: #666; margin-bottom: 10px;"><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString()}</p>
            <p style="color: #666; margin-bottom: 10px;"><strong>Total:</strong> ₵${order.total.toFixed(
              2
            )}</p>
            <p style="color: #666; margin-bottom: 10px;"><strong>Status:</strong> ${
              order.status
            }</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/account/orders/${order._id}" 
               style="background-color: #8BC34A; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; 
                      font-weight: bold;">
              View Order Details
            </a>
          </div>

          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We'll send you updates as your order progresses. Thank you for supporting 
            our artisans and their communities!
          </p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Sirahats. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Order Confirmed - #${order.orderNumber}`,
      html,
    });
  }

  static async sendOrderStatusUpdateEmail(
    order: any,
    user: any,
    status: string
  ) {
    const statusMessages = {
      processing: "Your order is being processed and prepared for shipping.",
      shipped: "Your order has been shipped and is on its way to you!",
      delivered:
        "Your order has been delivered. We hope you love your new items!",
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8BC34A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Update</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Order Status Updated</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.firstName},
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your order #${
              order.orderNumber
            } status has been updated to: <strong>${status}</strong>
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            ${statusMessages[status as keyof typeof statusMessages] || ""}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/account/orders/${order._id}" 
               style="background-color: #8BC34A; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; 
                      font-weight: bold;">
              View Order Details
            </a>
          </div>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Sirahats. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Order Update - #${order.orderNumber} is now ${status}`,
      html,
    });
  }

  static async sendPaymentConfirmationEmail(order: any, user: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8BC34A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Payment Confirmed!</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Payment Successful</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.firstName},
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We're pleased to confirm that your payment for order #${
              order.orderNumber
            } 
            has been processed successfully.
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Payment Details</h3>
            <p style="color: #666; margin-bottom: 10px;"><strong>Order Number:</strong> ${
              order.orderNumber
            }</p>
            <p style="color: #666; margin-bottom: 10px;"><strong>Amount Paid:</strong> ₵${order.total.toFixed(
              2
            )}</p>
            <p style="color: #666; margin-bottom: 10px;"><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/account/orders/${order._id}" 
               style="background-color: #8BC34A; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; 
                      font-weight: bold;">
              View Order Details
            </a>
          </div>

          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your order is now being processed and will be shipped soon. Thank you for 
            supporting our artisans!
          </p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Sirahats. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Payment Confirmed - Order #${order.orderNumber}`,
      html,
    });
  }

  static async sendPasswordResetEmail(
    user: any,
    resetToken: string,
    isAdmin: boolean = false
  ) {
    const resetUrl = isAdmin
      ? `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`
      : `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8BC34A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">${
            isAdmin ? "Sirahats Admin" : "Sirahats"
          }</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.firstName || "there"},
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your ${
              isAdmin ? "admin" : ""
            } account. 
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #8BC34A; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; 
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request a password reset, you can safely ignore this email. 
            Your password will remain unchanged.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #8BC34A;">${resetUrl}</a>
          </p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Sirahats. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `${isAdmin ? "Admin " : ""}Password Reset Request - Sirahats`,
      html,
    });
  }
}
