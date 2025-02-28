const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  approved: (username, artistName) => ({
    subject: "Your Artist Submission Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4affd7; text-align: center;">Good News, ${username}!</h2>
        <p>We're excited to inform you that your submission for <strong>${artistName}</strong> has been approved and added to our database.</p>
        <p>Your contribution helps make our electronic music database more comprehensive and valuable to the community.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #333;">You can now view the artist profile on our platform and share it with others.</p>
        </div>
        <p>Thank you for being part of the DJDB community!</p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px;">© ${new Date().getFullYear()} DJDB - Electronic Music Database</p>
        </div>
      </div>
    `,
  }),

  declined: (username, artistName) => ({
    subject: "Update on Your Artist Submission",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #ff3d81; text-align: center;">Hello, ${username}</h2>
        <p>We've reviewed your submission for <strong>${artistName}</strong> and unfortunately, we're unable to approve it at this time.</p>
        <p>This could be due to various reasons such as incomplete information, duplicate entries, or not meeting our current database criteria.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #333;">We encourage you to submit again with complete and accurate information.</p>
        </div>
        <p>If you have any questions or need clarification, please don't hesitate to contact us.</p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px;">© ${new Date().getFullYear()} DJDB - Electronic Music Database</p>
        </div>
      </div>
    `,
  }),
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    // Get the appropriate template
    const emailTemplate = emailTemplates[template](
      data.username,
      data.artistName
    );

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
