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
export const sendVerificationEmail = (email, verificationLink, name) => {
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

// Function to send a email after user booking successful
export const sendTicketBooked = (email, userTicketLink, name) => {
  const mailOptions = {
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: "Đặt vé thành công",
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="background-color: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Chúc mừng bạn đã đặt vé  thành công!</h2>
      <p style="color: #666; text-align: center; font-size: 16px;">Chào mừng ${name} đến với BookTicketMovie! Vui lòng đợi nhân viên của chúng tôi sẽ xác nhận vé trong giây lát, để xem thông tin và trang thái của vé vui lòng nhấn nút bên dưới.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${userTicketLink}" style="display: inline-block; padding: 12px 24px; background-color: #845EF7; color: #fff; text-decoration: none; border-radius: 15px; font-weight: bold;">Xem thông tin vé</a>
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

// Function to send a email after admin update ticket status successful
export const sendEmailAfterUpdateTicketStatus = (
  email,
  userTicketLink,
  dataTicket,
  seatsName
) => {
  const mailOptions = {
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: "Cập nhật trạng thái đặt vé",
    html: `<body style="font-family: Arial, sans-serif;background-color: #f5f5f5;margin: 0;padding: 0;">
    <div class="container" style="width: 80%;margin: 25px auto;background-color: #fff;border-radius: 8px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);overflow: hidden;">
        <div class="header" style="background-color: #845EF7;color: #fff;padding: 10px;text-align: center;">
            <h1>Thông tin vé xem phim</h1>
        </div>
        <div class="content" style="padding: 20px;">
            <div class="movie-info" style="margin-bottom: 30px;border-bottom: 1px solid #ddd;padding-bottom: 20px;">
                <h2 style="color: #333;font-size: 20px;margin-top: 0;">Tên phim: ${dataTicket.Show.Movie.title}</h2>
                <p style="margin: 8px 0;">Thời gian: ${dataTicket.Show.startTime} - ${dataTicket.Show.endTime}, ${dataTicket.Show.date}</p>
                <p style="margin: 8px 0;">Phòng chiếu: ${dataTicket.Show.MovieHall.name}</p>
                <p style="margin: 8px 0;">Trạng thái vé: <span class="bold" style="font-weight: bold;color: #845EF7;">${dataTicket.status}</span></p>
            </div>
            <div class="ticket-details" style="padding: 5px 18px;">
                <h3 style="color: #845EF7;margin-top: 0;">Thông tin vé:</h3>
                <p style="margin: 5px 0;font-size: 16px;"><span class="bold" style="font-weight: bold;color: #333;">Số ghế:</span> ${seatsName}</p>
                <p style="margin: 5px 0;font-size: 16px;"><span class="bold" style="font-weight: bold;color: #333;">Tổng tiền:</span> ${dataTicket.totalPrice} VND</p>
                <!-- Các thông tin khác có thể thêm vào ở đây -->
            </div>
        </div>
        <div class="footer" style="background-color: #845EF7;color: #fff;padding: 10px;text-align: center;">
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        </div>
    </div>
    <div style="text-align: center;">
        <a href="${userTicketLink}" style="display: inline-block; padding: 12px 24px; background-color: #845EF7; color: #fff; text-decoration: none; border-radius: 15px; font-weight: bold;">Xem thông tin vé</a>
      </div>
</body>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
