import nodemailer from "nodemailer";

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

let transporter = null;

if (SMTP_EMAIL && SMTP_PASSWORD) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD,
        },
    });
    console.log("📧 Email service configured:", SMTP_EMAIL);
} else {
    console.warn(
        "⚠️  SMTP_EMAIL or SMTP_PASSWORD missing — emails will be logged to console only.",
    );
}

/**
 * Send a password reset email.
 */
export async function sendResetPasswordEmail({ to, url, userName }) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#161b22,#1a1f2e);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="padding:32px 32px 0;text-align:center;">
                  <div style="display:inline-block;background:linear-gradient(135deg,rgba(34,211,238,0.2),rgba(147,51,234,0.2));border-radius:12px;padding:12px;margin-bottom:16px;">
                    <span style="font-size:32px;">🔐</span>
                  </div>
                  <h1 style="margin:0;font-size:24px;background:linear-gradient(to right,#22d3ee,#a855f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Reset Your Password</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:24px 32px;">
                  <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 8px;">Hi <strong style="color:#e5e7eb;">${userName || "there"}</strong>,</p>
                  <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">We received a request to reset your password for your AdroIT account. Click the button below to set a new password:</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${url}" style="display:inline-block;padding:14px 32px;background:linear-gradient(to right,#06b6d4,#a855f6);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;border-radius:12px;">Reset Password</a>
                      </td>
                    </tr>
                  </table>
                  <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:24px 0 0;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
                  <p style="color:#4b5563;font-size:12px;margin:0;">© AdroIT Cloud Computing Club • RNSIT</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

    if (!transporter) {
        console.log("📧 [DEV] Password reset email for", to);
        console.log("📧 [DEV] Reset URL:", url);
        return;
    }

    await transporter.sendMail({
        from: `"AdroIT Club" <${SMTP_EMAIL}>`,
        to,
        subject: "Reset Your Password — AdroIT",
        html,
    });

    console.log("📧 Password reset email sent to", to);
}

/**
 * Send a welcome email after admin approval.
 */
export async function sendWelcomeEmail({ to, userName }) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#161b22,#1a1f2e);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="padding:32px 32px 0;text-align:center;">
                  <div style="display:inline-block;background:linear-gradient(135deg,rgba(34,211,238,0.2),rgba(147,51,234,0.2));border-radius:12px;padding:12px;margin-bottom:16px;">
                    <span style="font-size:32px;">🎉</span>
                  </div>
                  <h1 style="margin:0;font-size:24px;background:linear-gradient(to right,#22d3ee,#a855f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Welcome to AdroIT!</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:24px 32px;">
                  <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 8px;">Hi <strong style="color:#e5e7eb;">${userName || "there"}</strong>,</p>
                  <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">Great news! Your AdroIT account has been approved by an admin. You now have full access to the platform, including:</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="color:#22d3ee;font-size:14px;">✦</span>
                        <span style="color:#d1d5db;font-size:14px;margin-left:8px;">Learning Resources & Study Materials</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="color:#a855f6;font-size:14px;">✦</span>
                        <span style="color:#d1d5db;font-size:14px;margin-left:8px;">Members Directory</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="color:#ec4899;font-size:14px;">✦</span>
                        <span style="color:#d1d5db;font-size:14px;margin-left:8px;">AI-Powered Chatbot Assistant</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="color:#22d3ee;font-size:14px;">✦</span>
                        <span style="color:#d1d5db;font-size:14px;margin-left:8px;">Profile Customization</span>
                      </td>
                    </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${FRONTEND_URL}/resources" style="display:inline-block;padding:14px 32px;background:linear-gradient(to right,#06b6d4,#a855f6);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;border-radius:12px;">Start Exploring →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
                  <p style="color:#4b5563;font-size:12px;margin:0;">© AdroIT Cloud Computing Club • RNSIT</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

    if (!transporter) {
        console.log("📧 [DEV] Welcome email for", to, "(", userName, ")");
        return;
    }

    await transporter.sendMail({
        from: `"AdroIT Club" <${SMTP_EMAIL}>`,
        to,
        subject: "Welcome to AdroIT — Your Account is Approved! 🎉",
        html,
    });

    console.log("📧 Welcome email sent to", to);
}
