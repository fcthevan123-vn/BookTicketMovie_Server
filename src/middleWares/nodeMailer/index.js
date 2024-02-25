/* eslint-disable no-undef */
import { createTransport } from "nodemailer";
const dotenv = require("dotenv");
dotenv.config();

// Create a transport object using SMTP
const transporter = createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_ACCOUNT, // Replace with your Gmail email address
    pass: process.env.MAIL_PASSWORD, // Replace with your Gmail password
  },
});

// Function to send a verification email
const sendVerificationEmail = (email, verificationLink, name) => {
  const mailOptions = {
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: "Xác nhận địa chỉ email - BookTicketMovie",
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="background-color: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Xác nhận địa chỉ email - BookTicketMovie</h2>
      <p style="color: #666; text-align: center; font-size: 16px;">Chào mừng ${name} đến với BookTicketMovie! Để tiếp tục, vui lòng xác nhận địa chỉ email của bạn bằng cách nhấn vào liên kết dưới đây:</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Xác nhận Email</a>
      </div>
      <p style="color: #666; text-align: center; margin-top: 30px; font-size: 14px;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    </div>
  </div>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendVerificationEmail;
