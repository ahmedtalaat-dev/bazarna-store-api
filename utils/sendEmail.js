const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const port = Number(process.env.EMAIL_PORT);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOpts = {
    from: `Bazarna Store <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7fb;padding:32px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
                
                <tr>
                  <td align="center" style="background:#1d4ed8;padding:28px 24px;">
                    <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:0.5px;">
                      Bazarna Store
                    </h1>
                    <p style="margin:8px 0 0;color:#dbeafe;font-size:14px;">
                      Account Security
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px 28px;">
                    <h2 style="margin:0 0 18px;font-size:22px;color:#111827;">
                      Reset Your Password
                    </h2>

                    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
                      Hello ${options.name || "there"},
                    </p>

                    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#4b5563;">
                      We received a request to reset the password for your Bazarna Store account.
                      Use the verification code below to continue.
                    </p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:22px 12px;">
                          <p style="margin:0 0 10px;font-size:12px;color:#1d4ed8;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                            Your verification code
                          </p>
                          <p style="margin:0;font-size:34px;font-weight:bold;letter-spacing:8px;color:#1e40af;">
                            ${options.resetCode || "------"}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:22px 0 8px;font-size:14px;line-height:1.7;color:#374151;">
                      <strong>Important:</strong> This code expires in 10 minutes.
                      For your security, do not share it with anyone.
                    </p>

                    <p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:#6b7280;">
                      If you didn't request a password reset, you can safely ignore this email.
                      Your password will remain unchanged.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
                    <p style="margin:0 0 6px;font-size:13px;color:#4b5563;">
                      Best regards, The Bazarna Store Team
                    </p>
                    <p style="margin:0;font-size:12px;color:#9ca3af;">
                      This is an automated message. Please do not reply.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
