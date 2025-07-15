import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
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
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #2563eb;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                background-color: #f8fafc;
                padding: 20px;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e2e8f0;
            }
            .field {
                margin-bottom: 15px;
            }
            .field-label {
                font-weight: bold;
                color: #1e293b;
                margin-bottom: 5px;
            }
            .field-value {
                background-color: white;
                padding: 10px;
                border-radius: 4px;
                border: 1px solid #cbd5e1;
            }
            .service-badge {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .priority {
                background-color: #dc2626;
                color: white;
                padding: 5px 12px;
                border-radius: 4px;
                font-weight: bold;
                display: inline-block;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚨 New Service Request</h1>
            <p>Quick Pro Booking - Customer Service Request</p>
        </div>

        <div class="content">
            <div class="field">
                <div class="field-label">Service Type:</div>
                <div class="field-value">
                    <span class="service-badge">${service}</span>
                </div>
            </div>

            <div class="field">
                <div class="field-label">Customer Details:</div>
                <div class="field-value">
                    <strong>Name:</strong> ${name}<br>
                    <strong>Phone:</strong> ${phone}<br>
                    ${email ? `<strong>Email:</strong> ${email}<br>` : ""}
                </div>
            </div>

            <div class="field">
                <div class="field-label">Service Address:</div>
                <div class="field-value">
                    ${address}<br>
                    ${city}, MD ${zip}
                </div>
            </div>

            <div class="field">
                <div class="field-label">Preferred Schedule:</div>
                <div class="field-value">
                    <strong>Date:</strong> ${
                      preferredDate || "Not specified"
                    }<br>
                    <strong>Time:</strong> ${preferredTime || "Not specified"}
                </div>
            </div>

            <div class="field">
                <div class="field-label">Service Description:</div>
                <div class="field-value">
                    ${description || "No description provided"}
                </div>
            </div>

            ${showAttachmentInfo(fileData)}

            ${
              preferredTime === "Emergency (ASAP)"
                ? '<div class="priority">⚠️ EMERGENCY REQUEST - URGENT ATTENTION REQUIRED</div>'
                : ""
            }

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">

            <p style="font-size: 12px; color: #64748b; text-align: center;">
                This request was submitted through the Quick Pro Booking website.<br>
                Please respond to the customer within 2 hours.
            </p>
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
