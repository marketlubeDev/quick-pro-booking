import nodemailer from "nodemailer";

// Create transporter with error handling
const createTransporter = () => {
  const requiredEnvVars = [
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error("Missing email configuration:", missingVars);
    throw new Error(`Missing email configuration: ${missingVars.join(", ")}`);
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add timeout settings for serverless
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
};

// Email templates
const createEmailTemplate = (data) => {
  const {
    service,
    description,
    preferredDate,
    preferredTime,
    name,
    phone,
    email,
    address,
    city,
    zip,
    fileData,
  } = data;

  // Function to show attachment info in email body
  const showAttachmentInfo = (fileData) => {
    if (!fileData || !fileData.buffer) return "";

    const fileName = fileData.originalname;
    const mimeType = fileData.mimetype;

    if (mimeType.startsWith("image/")) {
      return `
        <div class="field">
            <div class="field-label">Attached Image:</div>
            <div class="field-value">
                📷 ${fileName} (Image file - see attachment below)
            </div>
        </div>
      `;
    } else {
      return `
        <div class="field">
            <div class="field-label">Attached File:</div>
            <div class="field-value">
                📎 ${fileName}
            </div>
        </div>
      `;
    }
  };

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Service Request</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #2d3748;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                min-height: 100vh;
            }

            .email-container {
                max-width: 650px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }

            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }

            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            }

            .header p {
                font-size: 16px;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }

            .content {
                padding: 40px 30px;
                background: #fafbfc;
            }

            .section {
                background: white;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 20px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }

            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .service-badge {
                display: inline-block;
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            }

            .field {
                margin-bottom: 20px;
            }

            .field-label {
                font-weight: 600;
                color: #4a5568;
                margin-bottom: 8px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .field-value {
                background: #f7fafc;
                padding: 12px 16px;
                border-radius: 8px;
                border-left: 4px solid #4f46e5;
                font-size: 15px;
                color: #2d3748;
            }

            .customer-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }

            .info-item {
                background: #f7fafc;
                padding: 12px 16px;
                border-radius: 8px;
                border-left: 4px solid #38b2ac;
            }

            .info-label {
                font-size: 12px;
                font-weight: 600;
                color: #718096;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
            }

            .info-value {
                font-size: 15px;
                font-weight: 500;
                color: #2d3748;
            }

            .priority {
                background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
                box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }

            .footer {
                background: #2d3748;
                color: #a0aec0;
                padding: 25px 30px;
                text-align: center;
                font-size: 13px;
                line-height: 1.5;
            }

            .footer a {
                color: #63b3ed;
                text-decoration: none;
            }

            .attachment-info {
                background: #edf2f7;
                border: 1px solid #cbd5e0;
                border-radius: 8px;
                padding: 12px 16px;
                margin-top: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .attachment-icon {
                font-size: 18px;
            }

            .service-details {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 20px;
                align-items: start;
            }

            .service-type {
                flex-shrink: 0;
            }

            .service-description {
                flex: 1;
            }

            @media (max-width: 768px) {
                .service-details {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }

                .customer-info {
                    grid-template-columns: 1fr;
                }

                .header, .content {
                    padding: 25px 20px;
                }

                .section {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🚨 New Service Request</h1>
                <p>Quick Pro Booking - Professional Service Request</p>
            </div>

            <div class="content">
                <div class="section">
                    <div class="section-title">
                        <span>🔧</span>
                        Service Information
                    </div>
                    <div class="service-details">
                        <div class="service-type">
                            <div class="field-label">Service Type</div>
                            <div class="field-value">
                                <span class="service-badge">${service}</span>
                            </div>
                        </div>
                        <div class="service-description">
                            <div class="field-label">Description</div>
                            <div class="field-value">
                                ${description || "No description provided"}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <span>👤</span>
                        Customer Details
                    </div>
                    <div class="customer-info">
                        <div class="info-item">
                            <div class="info-label">Name</div>
                            <div class="info-value">${name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Phone</div>
                            <div class="info-value">${phone}</div>
                        </div>
                        ${
                          email
                            ? `
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value">${email}</div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <span>📍</span>
                        Service Location
                    </div>
                    <div class="field">
                        <div class="field-value">
                            ${address}<br>
                            ${city}, MD ${zip}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <span>📅</span>
                        Preferred Schedule
                    </div>
                    <div class="customer-info">
                        <div class="info-item">
                            <div class="info-label">Date</div>
                            <div class="info-value">${
                              preferredDate || "Not specified"
                            }</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Time</div>
                            <div class="info-value">${
                              preferredTime || "Not specified"
                            }</div>
                        </div>
                    </div>
                </div>

                ${
                  fileData && fileData.buffer
                    ? `
                <div class="section">
                    <div class="section-title">
                        <span>📎</span>
                        Attachments
                    </div>
                    <div class="attachment-info">
                        <span class="attachment-icon">${
                          fileData.mimetype.startsWith("image/") ? "📷" : "📎"
                        }</span>
                        <span>${fileData.originalname}</span>
                    </div>
                </div>
                `
                    : ""
                }

                ${
                  preferredTime === "Emergency (ASAP)"
                    ? '<div class="priority">⚠️ EMERGENCY REQUEST - URGENT ATTENTION REQUIRED</div>'
                    : ""
                }
            </div>

            <div class="footer">
                <p>This request was submitted through the SkillHands website.</p>
                <p><strong>Please respond to the customer within 2 hours.</strong></p>
                <p style="margin-top: 15px;">
                    <a href="mailto:${
                      email || "customer@example.com"
                    }">Reply to Customer</a> |
                    <a href="tel:${phone}">Call Customer</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textTemplate = `
NEW SERVICE REQUEST - Quick Pro Booking

Service Type: ${service}
Customer: ${name}
Phone: ${phone}
${email ? `Email: ${email}` : ""}

Address: ${address}, ${city}, MD ${zip}

Preferred Date: ${preferredDate || "Not specified"}
Preferred Time: ${preferredTime || "Not specified"}

Description: ${description || "No description provided"}

${fileData ? `Attached File: ${fileData.originalname}` : ""}

${
  preferredTime === "Emergency (ASAP)"
    ? "⚠️ EMERGENCY REQUEST - URGENT ATTENTION REQUIRED"
    : ""
}

---
This request was submitted through the Quick Pro Booking website.
Please respond to the customer within 2 hours.
  `;

  return { html: htmlTemplate, text: textTemplate };
};

// Send email function
export const sendEmail = async (data) => {
  try {
    const transporter = createTransporter();
    const { html, text } = createEmailTemplate(data);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Service Request: ${data.service} - ${data.name}`,
      html: html,
      text: text,
    };

    // Add attachment if file data is provided
    if (data.fileData && data.fileData.buffer) {
      mailOptions.attachments = [
        {
          filename: data.fileData.originalname,
          content: data.fileData.buffer,
          contentType: data.fileData.mimetype,
        },
      ];
    }

    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", result.messageId);

    return {
      messageId: result.messageId,
      success: true,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendOtpEmail = async ({ to, otp }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your SkillHands password reset code",
    text: `Your one-time password (OTP) is ${otp}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#1f2937">
        <h2 style="margin:0 0 8px">Password reset code</h2>
        <p style="margin:0 0 16px">Use the following one-time password (OTP) to reset your password. This code expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:4px;background:#111827;color:#fff;display:inline-block;padding:12px 16px;border-radius:8px">${otp}</div>
        <p style="margin:16px 0 0;color:#6b7280;font-size:14px">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };
  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
};

// Send scheduling confirmation to the customer
export const sendScheduleConfirmationEmail = async ({
  to,
  name,
  service,
  scheduledDateISO,
  address,
  city,
  state,
  zip,
}) => {
  const transporter = createTransporter();

  const scheduledDate = scheduledDateISO ? new Date(scheduledDateISO) : null;
  const formattedDate = scheduledDate
    ? scheduledDate.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "(date pending)";

  const subject = `Your ${service || "service"} is scheduled`;
  const text = `Hello ${name || "Customer"},

This is a confirmation that your ${
    service || "service"
  } has been scheduled for ${formattedDate}.

Location: ${[address, city, state, zip].filter(Boolean).join(", ")}

If you need to make any changes, please reply to this email.

— SkillHands · Quick Pro Booking`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <body style="margin:0;background:#f6f7fb;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(2,6,23,0.08);">
                <tr>
                  <td style="padding:24px;background:#6366f1;background-image:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;">
                    <h1 style="margin:0;font-size:20px;font-weight:800;letter-spacing:.2px;">Schedule confirmed</h1>
                    <p style="margin:6px 0 0;font-size:13px;opacity:.95;">SkillHands · Quick Pro Booking</p>
                    <span style="display:inline-block;margin-top:10px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.18);color:#fff;font-size:12px;font-weight:700;">Booking update</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;background:#ffffff;">
                    <p style="margin:0 0 8px;font-size:15px;color:#111827;">Hi ${
                      name || "there"
                    },</p>
                    <p style="margin:0 0 16px;color:#374151;font-size:14px;">Your <span style="display:inline-block;background:#0ea5e9;color:#ffffff;font-weight:700;padding:8px 12px;border-radius:12px;">${(
                      service || "service"
                    ).toString()}</span> has been scheduled.</p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 8px;">
                      <tr>
                        <td style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b7280;font-weight:800;">Date & time</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${formattedDate}</div>
                        </td>
                      </tr>
                      <tr>
                        <td height="12"></td>
                      </tr>
                      <tr>
                        <td style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b7280;font-weight:800;">Location</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${[
                            address,
                            city,
                            state,
                            zip,
                          ]
                            .filter(Boolean)
                            .join(", ")}</div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:16px 0 0;color:#374151;font-size:14px;">Need to make a change? Just reply to this email and we’ll help you out.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 24px 24px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;background:#ffffff;">
                    <div>Thank you for choosing SkillHands.</div>
                    <div style="margin-top:6px;">This message was sent automatically; replies go to our support team.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    cc: process.env.EMAIL_TO,
    subject,
    text,
    html,
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
};

// Notify admin: new employee registration
export const sendNewEmployeeEmail = async ({
  name,
  email,
  role,
  designation,
  expectedSalary,
  address,
  city,
  state,
  postalCode,
}) => {
  const transporter = createTransporter();
  const to = process.env.EMAIL_TO;
  if (!to) {
    // If no recipient configured, skip silently
    return { success: false, skipped: true };
  }
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `New employee registered: ${name || email}`,
    text: `A new employee account was created.\n\nName: ${
      name || "(not provided)"
    }\nEmail: ${email}\nRole: ${role}${
      designation ? `\nDesignation: ${designation}` : ""
    }${
      expectedSalary !== undefined && expectedSalary !== null
        ? `\nExpected Salary: ${expectedSalary} AED`
        : ""
    }${
      address || city || state || postalCode
        ? `\nAddress: ${address || ""}${city ? `, ${city}` : ""}${
            state ? `, ${state}` : ""
          }${postalCode ? ` ${postalCode}` : ""}`
        : ""
    }\n\nThis notification was generated automatically by SkillHands.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Employee Registration</title>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#f5f7fb;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#111827;line-height:1.6;padding:24px}
          .container{max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 48px rgba(2,6,23,0.08)}
          .header{position:relative;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:28px 28px 24px;color:#fff}
          .header h1{font-size:22px;font-weight:800;letter-spacing:.2px;margin-bottom:4px}
          .header p{opacity:.95;font-size:14px}
          .pill{display:inline-block;margin-top:12px;background:rgba(255,255,255,.15);backdrop-filter:blur(2px);padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600}
          .content{padding:24px;background:#ffffff}
          .section{border:1px solid #e5e7eb;border-radius:12px;padding:18px 16px;margin-bottom:16px;background:#fafafa}
          .title{font-size:14px;font-weight:700;color:#374151;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
          .item{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px}
          .label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;margin-bottom:6px;font-weight:700}
          .value{font-size:15px;color:#111827;font-weight:600}
          .footer{padding:18px 24px;background:#0f172a;color:#cbd5e1;text-align:center;font-size:12px}
          .footer a{color:#93c5fd;text-decoration:none}
          @media (max-width: 540px){.grid{grid-template-columns:1fr}}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New employee registration</h1>
            <p>A new employee account was just created.</p>
            <span class="pill">SkillHands · Quick Pro Booking</span>
          </div>
          <div class="content">
            <div class="section">
              <div class="title">Employee</div>
              <div class="grid">
                <div class="item">
                  <div class="label">Name</div>
                  <div class="value">${name || "(not provided)"}</div>
                </div>
                <div class="item">
                  <div class="label">Email</div>
                  <div class="value">${email}</div>
                </div>
                <div class="item">
                  <div class="label">Role</div>
                  <div class="value">${role}</div>
                </div>
                ${
                  designation
                    ? `
                <div class="item">
                  <div class="label">Designation</div>
                  <div class="value">${designation}</div>
                </div>`
                    : ""
                }
              ${
                expectedSalary !== undefined && expectedSalary !== null
                  ? `
                <div class="item">
                  <div class="label">Expected Salary</div>
                  <div class="value">${expectedSalary} AED</div>
                </div>`
                  : ""
              }
              </div>
            </div>

            ${
              address || city || state || postalCode
                ? `
            <div class="section">
              <div class="title">Address</div>
              <div class="grid">
                <div class="item">
                  <div class="label">Street</div>
                  <div class="value">${address || "—"}</div>
                </div>
                <div class="item">
                  <div class="label">City</div>
                  <div class="value">${city || "—"}</div>
                </div>
                <div class="item">
                  <div class="label">State</div>
                  <div class="value">${state || "—"}</div>
                </div>
                <div class="item">
                  <div class="label">Postal code</div>
                  <div class="value">${postalCode || "—"}</div>
                </div>
              </div>
            </div>`
                : ""
            }
          </div>
          <div class="footer">
            <div>This notification was generated automatically by SkillHands.</div>
            <div style="margin-top:6px">Please follow up in your admin dashboard.</div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
};

// Send service completion notification to customer
export const sendServiceCompletionEmail = async ({
  to,
  name,
  service,
  completedAt,
  address,
  city,
  state,
  zip,
  assignedEmployee,
  completionNotes,
}) => {
  const transporter = createTransporter();

  const completionDate = completedAt ? new Date(completedAt) : new Date();
  const formattedDate = completionDate.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `Your ${service || "service"} has been completed`;
  const text = `Hello ${name || "Customer"},

Great news! Your ${service || "service"} has been completed on ${formattedDate}.

Location: ${[address, city, state, zip].filter(Boolean).join(", ")}
${assignedEmployee ? `Service Provider: ${assignedEmployee}` : ""}
${completionNotes ? `Notes: ${completionNotes}` : ""}

Thank you for choosing SkillHands. We hope you're satisfied with our service!

If you have any questions or need follow-up service, please don't hesitate to contact us.

— SkillHands · Quick Pro Booking`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <body style="margin:0;background:#f6f7fb;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(2,6,23,0.08);">
                <tr>
                  <td style="padding:24px;background:#10b981;background-image:linear-gradient(135deg,#10b981,#059669);color:#ffffff;">
                    <h1 style="margin:0;font-size:20px;font-weight:800;letter-spacing:.2px;">✅ Service Completed</h1>
                    <p style="margin:6px 0 0;font-size:13px;opacity:.95;">SkillHands · Quick Pro Booking</p>
                    <span style="display:inline-block;margin-top:10px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.18);color:#fff;font-size:12px;font-weight:700;">Service update</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;background:#ffffff;">
                    <p style="margin:0 0 8px;font-size:15px;color:#111827;">Hi ${
                      name || "there"
                    },</p>
                    <p style="margin:0 0 16px;color:#374151;font-size:14px;">Great news! Your <span style="display:inline-block;background:#10b981;color:#ffffff;font-weight:700;padding:8px 12px;border-radius:12px;">${(
                      service || "service"
                    ).toString()}</span> has been completed.</p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 8px;">
                      <tr>
                        <td style="padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#166534;font-weight:800;">Completed on</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${formattedDate}</div>
                        </td>
                      </tr>
                      <tr>
                        <td height="12"></td>
                      </tr>
                      <tr>
                        <td style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b7280;font-weight:800;">Location</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${[
                            address,
                            city,
                            state,
                            zip,
                          ]
                            .filter(Boolean)
                            .join(", ")}</div>
                        </td>
                      </tr>
                      ${
                        assignedEmployee
                          ? `
                      <tr>
                        <td height="12"></td>
                      </tr>
                      <tr>
                        <td style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b7280;font-weight:800;">Service Provider</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${assignedEmployee}</div>
                        </td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        completionNotes
                          ? `
                      <tr>
                        <td height="12"></td>
                      </tr>
                      <tr>
                        <td style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b7280;font-weight:800;">Completion Notes</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${completionNotes}</div>
                        </td>
                      </tr>
                      `
                          : ""
                      }
                    </table>

                    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:16px 0;">
                      <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">🎉 Thank you for choosing SkillHands!</p>
                      <p style="margin:8px 0 0;color:#374151;font-size:14px;">We hope you're satisfied with our service. If you have any questions or need follow-up service, please don't hesitate to contact us.</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 24px 24px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;background:#ffffff;">
                    <div>Thank you for choosing SkillHands.</div>
                    <div style="margin-top:6px;">This message was sent automatically; replies go to our support team.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    cc: process.env.EMAIL_TO,
    subject,
    text,
    html,
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
};

// Send service rejection notification to customer
export const sendServiceRejectionEmail = async ({
  to,
  name,
  service,
  rejectionReason,
  address,
  city,
  state,
  zip,
  requestId,
}) => {
  const transporter = createTransporter();

  const subject = `Service Request Update: ${
    service || "Your service request"
  }`;
  const text = `Hello ${name || "Customer"},

We regret to inform you that we are unable to fulfill your service request at this time.

Service: ${service || "Service request"}
Request ID: ${requestId || "N/A"}
Location: ${[address, city, state, zip].filter(Boolean).join(", ")}

Reason: ${rejectionReason || "No specific reason provided"}

We apologize for any inconvenience this may cause. If you have any questions or would like to discuss alternative solutions, please don't hesitate to contact us.

Thank you for considering SkillHands for your service needs.

— SkillHands · Quick Pro Booking`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <body style="margin:0;background:#f6f7fb;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(2,6,23,0.08);">
                <tr>
                  <td style="padding:24px;background:#dc2626;background-image:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;">
                    <h1 style="margin:0;font-size:20px;font-weight:800;letter-spacing:.2px;">Service Request Update</h1>
                    <p style="margin:6px 0 0;font-size:13px;opacity:.95;">SkillHands · Quick Pro Booking</p>
                    <span style="display:inline-block;margin-top:10px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.18);color:#fff;font-size:12px;font-weight:700;">Request update</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;background:#ffffff;">
                    <p style="margin:0 0 8px;font-size:15px;color:#111827;">Hi ${
                      name || "there"
                    },</p>
                    <p style="margin:0 0 16px;color:#374151;font-size:14px;">We regret to inform you that we are unable to fulfill your <span style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;padding:8px 12px;border-radius:12px;">${(
                      service || "service request"
                    ).toString()}</span> at this time.</p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 8px;">
                      <tr>
                        <td style="padding:14px;background:#fef2f2;border:1px solid #fecaca;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#991b1b;font-weight:800;">Request ID</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${
                            requestId || "N/A"
                          }</div>
                        </td>
                      </tr>
                      <tr>
                        <td height="12"></td>
                      </tr>
                      <tr>
                        <td style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#6b7280;font-weight:800;">Location</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${[
                            address,
                            city,
                            state,
                            zip,
                          ]
                            .filter(Boolean)
                            .join(", ")}</div>
                        </td>
                      </tr>
                      <tr>
                        <td height="12"></td>
                      </tr>
                      <tr>
                        <td style="padding:14px;background:#fef2f2;border:1px solid #fecaca;border-radius:12px;">
                          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#991b1b;font-weight:800;">Reason</div>
                          <div style="font-size:15px;color:#111827;font-weight:600;">${
                            rejectionReason || "No specific reason provided"
                          }</div>
                        </td>
                      </tr>
                    </table>

                    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:16px 0;">
                      <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;">💬 We're here to help</p>
                      <p style="margin:8px 0 0;color:#374151;font-size:14px;">We apologize for any inconvenience this may cause. If you have any questions or would like to discuss alternative solutions, please don't hesitate to contact us.</p>
                    </div>

                    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px;margin:16px 0;">
                      <p style="margin:0;color:#0369a1;font-size:14px;font-weight:600;">📞 Contact Us</p>
                      <p style="margin:8px 0 0;color:#374151;font-size:14px;">Thank you for considering SkillHands for your service needs. We look forward to serving you in the future.</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 24px 24px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;background:#ffffff;">
                    <div>Thank you for choosing SkillHands.</div>
                    <div style="margin-top:6px;">This message was sent automatically; replies go to our support team.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    cc: process.env.EMAIL_TO,
    subject,
    text,
    html,
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
};

// Send employee application approval notification
export const sendEmployeeApplicationApprovalEmail = async ({
  to,
  name,
  designation,
  address,
  postalCode,
  skills,
  expectedSalary,
  verificationNotes,
}) => {
  const transporter = createTransporter();

  const subject = `🎉 Congratulations! Your SkillHands Application Has Been Approved`;
  const text = `Hello ${name || "Applicant"},

Congratulations! We are pleased to inform you that your application to join SkillHands has been approved.

Application Details:
- Name: ${name || "N/A"}
- Designation: ${designation || "N/A"}
- Address: ${address || "N/A"}
- Zip Code: ${postalCode || "N/A"}
- Expected Salary: ${expectedSalary ? `${expectedSalary} AED` : "N/A"}
- Skills: ${skills ? skills.join(", ") : "N/A"}

${verificationNotes ? `Notes from our team: ${verificationNotes}` : ""}

What's Next?
1. You can now log into your SkillHands account
2. Complete your profile to start receiving job opportunities
3. Browse available service requests in your area
4. Start building your reputation with our customers

We're excited to have you as part of the SkillHands team! If you have any questions, please don't hesitate to contact us.

Welcome aboard!

— SkillHands · Quick Pro Booking Team`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Application Approved - SkillHands</title>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#f5f7fb;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#111827;line-height:1.6;padding:24px}
          .container{max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 48px rgba(2,6,23,0.08)}
          .header{position:relative;background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:28px 28px 24px;color:#fff}
          .header h1{font-size:22px;font-weight:800;letter-spacing:.2px;margin-bottom:4px}
          .header p{opacity:.95;font-size:14px}
          .pill{display:inline-block;margin-top:12px;background:rgba(255,255,255,.15);backdrop-filter:blur(2px);padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600}
          .content{padding:24px;background:#ffffff}
          .section{border:1px solid #e5e7eb;border-radius:12px;padding:18px 16px;margin-bottom:16px;background:#f0fdf4}
          .title{font-size:14px;font-weight:700;color:#374151;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
          .item{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px}
          .label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;margin-bottom:6px;font-weight:700}
          .value{font-size:15px;color:#111827;font-weight:600}
          .success-badge{display:inline-flex;align-items:center;gap:6px;background:#10b981;color:#fff;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:16px}
          .next-steps{background:#fef3c7;border:1px solid #f59e0b;border-radius:12px;padding:18px;margin:16px 0}
          .next-steps h3{color:#92400e;font-size:16px;font-weight:700;margin-bottom:12px}
          .next-steps ol{color:#92400e;padding-left:20px}
          .next-steps li{margin-bottom:8px;font-size:14px}
          .footer{padding:18px 24px;background:#0f172a;color:#cbd5e1;text-align:center;font-size:12px}
          .footer a{color:#93c5fd;text-decoration:none}
          @media (max-width: 540px){.grid{grid-template-columns:1fr}}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Application Approved!</h1>
            <p>Welcome to the SkillHands team!</p>
            <span class="pill">SkillHands · Quick Pro Booking</span>
          </div>
          <div class="content">
            <div class="success-badge">
              ✅ Application Status: Approved
            </div>

            <p style="font-size:16px;color:#111827;margin-bottom:20px;">
              Hello <strong>${name || "Applicant"}</strong>,
            </p>

            <p style="font-size:15px;color:#374151;margin-bottom:20px;">
              Congratulations! We are pleased to inform you that your application to join SkillHands has been approved. We're excited to have you as part of our team!
            </p>

            <div class="section">
              <div class="title">Application Details</div>
              <div class="grid">
                <div class="item">
                  <div class="label">Name</div>
                  <div class="value">${name || "N/A"}</div>
                </div>
                <div class="item">
                  <div class="label">Designation</div>
                  <div class="value">${designation || "N/A"}</div>
                </div>
                <div class="item">
                  <div class="label">Address</div>
                  <div class="value">${address || "N/A"}</div>
                </div>
                <div class="item">
                  <div class="label">Zip Code</div>
                  <div class="value">${postalCode || "N/A"}</div>
                </div>
                <div class="item">
                  <div class="label">Expected Salary</div>
                  <div class="value">${
                    expectedSalary ? `${expectedSalary} AED` : "N/A"
                  }</div>
                </div>
              </div>
              ${
                skills && skills.length > 0
                  ? `
                <div style="margin-top:12px;">
                  <div class="label">Skills</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
                    ${skills
                      .map(
                        (skill) =>
                          `<span style="background:#e5e7eb;color:#374151;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:500;">${skill}</span>`
                      )
                      .join("")}
                  </div>
                </div>
              `
                  : ""
              }
            </div>

            ${
              verificationNotes
                ? `
              <div class="section" style="background:#fef3c7;border-color:#f59e0b;">
                <div class="title" style="color:#92400e;">Notes from our team</div>
                <p style="color:#92400e;font-size:14px;margin:0;">${verificationNotes}</p>
              </div>
            `
                : ""
            }

            <div class="next-steps">
              <h3>🚀 What's Next?</h3>
              <ol>
                <li>Log into your SkillHands account</li>
                <li>Complete your profile to start receiving job opportunities</li>
                <li>Browse available service requests in your area</li>
                <li>Start building your reputation with our customers</li>
              </ol>
            </div>

            <p style="font-size:15px;color:#374151;margin-top:20px;">
              If you have any questions, please don't hesitate to contact us. We're here to help you succeed!
            </p>

            <p style="font-size:15px;color:#374151;margin-top:16px;">
              Welcome aboard!<br>
              <strong>— SkillHands · Quick Pro Booking Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 SkillHands · Quick Pro Booking. All rights reserved.</p>
            <p>This email was sent to ${to}. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    cc: process.env.EMAIL_TO,
    subject,
    text,
    html,
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
};

// Send employee application rejection notification
export const sendEmployeeApplicationRejectionEmail = async ({
  to,
  name,
  designation,
  experienceLevel,
  skills,
  expectedSalary,
  verificationNotes,
  rejectionReason,
}) => {
  const transporter = createTransporter();

  const subject = `Application Update: SkillHands Employee Application`;
  const text = `Hello ${name || "Applicant"},

Thank you for your interest in joining SkillHands. After careful consideration, we regret to inform you that we are unable to approve your application at this time.

Application Details:
- Name: ${name || "N/A"}
- Designation: ${designation || "N/A"}
- Experience Level: ${experienceLevel || "N/A"}
- Expected Salary: ${expectedSalary ? `${expectedSalary} AED` : "N/A"}
- Skills: ${skills ? skills.join(", ") : "N/A"}

${
  rejectionReason
    ? `Reason for rejection: ${rejectionReason}`
    : verificationNotes
    ? `Feedback: ${verificationNotes}`
    : "We encourage you to continue developing your skills and consider reapplying in the future."
}

We appreciate the time and effort you put into your application. While we cannot move forward at this time, we encourage you to:
1. Continue building your skills and experience
2. Consider reapplying in the future
3. Stay connected with us for future opportunities

Thank you for your interest in SkillHands, and we wish you the best in your professional journey.

— SkillHands · Quick Pro Booking Team`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Application Update - SkillHands</title>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#f5f7fb;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#111827;line-height:1.6;padding:24px}
          .container{max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 48px rgba(2,6,23,0.08)}
          .header{position:relative;background:linear-gradient(135deg,#6b7280 0%,#4b5563 100%);padding:28px 28px 24px;color:#fff}
          .header h1{font-size:22px;font-weight:800;letter-spacing:.2px;margin-bottom:4px}
          .header p{opacity:.95;font-size:14px}
          .pill{display:inline-block;margin-top:12px;background:rgba(255,255,255,.15);backdrop-filter:blur(2px);padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600}
          .content{padding:24px;background:#ffffff}
          .section{border:1px solid #e5e7eb;border-radius:12px;padding:18px 16px;margin-bottom:16px;background:#f9fafb}
          .title{font-size:14px;font-weight:700;color:#374151;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
          .item{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px}
          .label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;margin-bottom:6px;font-weight:700}
          .value{font-size:15px;color:#111827;font-weight:600}
          .status-badge{display:inline-flex;align-items:center;gap:6px;background:#ef4444;color:#fff;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:16px}
          .encouragement{background:#fef3c7;border:1px solid #f59e0b;border-radius:12px;padding:18px;margin:16px 0}
          .encouragement h3{color:#92400e;font-size:16px;font-weight:700;margin-bottom:12px}
          .encouragement ol{color:#92400e;padding-left:20px}
          .encouragement li{margin-bottom:8px;font-size:14px}
          .footer{padding:18px 24px;background:#0f172a;color:#cbd5e1;text-align:center;font-size:12px}
          .footer a{color:#93c5fd;text-decoration:none}
          @media (max-width: 540px){.grid{grid-template-columns:1fr}}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
            <p>Thank you for your interest in SkillHands</p>
            <span class="pill">SkillHands · Quick Pro Booking</span>
          </div>
          <div class="content">
            <div class="status-badge">
              📋 Application Status: Not Approved
            </div>

            <p style="font-size:16px;color:#111827;margin-bottom:20px;">
              Hello <strong>${name || "Applicant"}</strong>,
            </p>

            <p style="font-size:15px;color:#374151;margin-bottom:20px;">
              Thank you for your interest in joining SkillHands. After careful consideration, we regret to inform you that we are unable to approve your application at this time.
            </p>

            <div class="section">
              <div class="title">Application Details</div>
              <div class="grid">
                <div class="item">
                  <div class="label">Name</div>
                  <div class="value">${name || "N/A"}</div>
                </div>
                <div class="item">
                  <div class="label">Designation</div>
                  <div class="value">${designation || "N/A"}</div>
                </div>
                <div class="item">
                  <div class="label">Experience Level</div>
                  <div class="value">${experienceLevel || "N/A"}</div>
                </div>
                <div class="item">
                  <div class="label">Expected Salary</div>
                  <div class="value">${
                    expectedSalary ? `${expectedSalary} AED` : "N/A"
                  }</div>
                </div>
              </div>
              ${
                skills && skills.length > 0
                  ? `
                <div style="margin-top:12px;">
                  <div class="label">Skills</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
                    ${skills
                      .map(
                        (skill) =>
                          `<span style="background:#e5e7eb;color:#374151;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:500;">${skill}</span>`
                      )
                      .join("")}
                  </div>
                </div>
              `
                  : ""
              }
            </div>

            ${
              rejectionReason
                ? `
              <div class="section" style="background:#fef3c7;border-color:#f59e0b;">
                <div class="title" style="color:#92400e;">Reason for Rejection</div>
                <p style="color:#92400e;font-size:14px;margin:0;">${rejectionReason}</p>
              </div>
            `
                : verificationNotes
                ? `
              <div class="section" style="background:#fef3c7;border-color:#f59e0b;">
                <div class="title" style="color:#92400e;">Feedback</div>
                <p style="color:#92400e;font-size:14px;margin:0;">${verificationNotes}</p>
              </div>
            `
                : ""
            }

            <div class="encouragement">
              <h3>💪 Keep Moving Forward</h3>
              <p style="color:#92400e;font-size:14px;margin-bottom:12px;">
                We appreciate the time and effort you put into your application. While we cannot move forward at this time, we encourage you to:
              </p>
              <ol>
                <li>Continue building your skills and experience</li>
                <li>Consider reapplying in the future</li>
                <li>Stay connected with us for future opportunities</li>
              </ol>
            </div>

            <p style="font-size:15px;color:#374151;margin-top:20px;">
              Thank you for your interest in SkillHands, and we wish you the best in your professional journey.
            </p>

            <p style="font-size:15px;color:#374151;margin-top:16px;">
              <strong>— SkillHands · Quick Pro Booking Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 SkillHands · Quick Pro Booking. All rights reserved.</p>
            <p>This email was sent to ${to}. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    cc: process.env.EMAIL_TO,
    subject,
    text,
    html,
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
};

// Safe email sending wrapper
const safeSendEmail = async (emailFunction, ...args) => {
  try {
    return await emailFunction(...args);
  } catch (error) {
    console.error("Email sending failed:", error);
    // Don't throw error in production to prevent 500 errors
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
