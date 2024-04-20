import { validationResult } from "express-validator";
import moment from "moment";
import { bookingServices } from "../../services";
import { sendEmailAfterUpdateTicketStatus } from "../../middleWares/nodeMailer";
import db from "../models";

// send email after update ticket status successful
async function sendEmailUpdateTicketStatus(bookingId) {
  try {
    const infoBooking = await db.Booking.findOne({
      where: {
        id: bookingId,
      },
      include: [
        {
          model: db.Show,
          include: [
            {
              model: db.MovieHall,
              include: [{ model: db.Cinema }, { model: db.RoomType }],
            },
            {
              model: db.Movie,
            },
          ],
        },
        {
          model: db.SeatStatus,
          include: [
            {
              model: db.Seat,
            },
          ],
        },
        {
          model: db.User,
        },
      ],
    });

    if (!infoBooking) {
      return false;
    }

    const seatsName = infoBooking.SeatStatuses.map((item) => {
      return item.Seat.name;
    }).join(", ");

    const userTicketLink = `http://127.0.0.1:5173/user/${infoBooking.User.id}/all-tickets`;

    sendEmailAfterUpdateTicketStatus(
      infoBooking.User.email,
      userTicketLink,
      infoBooking,
      seatsName
    );

    return true;
  } catch (error) {
    console.log("error", error);
  }
}

// sortObject function
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

class PaymentController {
  async createPaymentUrl(req, res) {
    const data = req.body;

    const {
      userId,
      paymentMethod,
      seatIds,
      totalPrice,
      showId,
      isPaid,
      discount,
      status,
      sendEmail,
    } = data;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: errors.array(),
      });
    }

    // create booking
    const createBooking = await bookingServices.createBooking(
      userId,
      paymentMethod,
      seatIds,
      totalPrice,
      showId,
      isPaid,
      discount,
      status,
      sendEmail
    );

    if (createBooking.statusCode != 0) {
      return res.status(401).json({
        statusCode: 2,
        message: "Tạo vé xem phim thất bại",
        errors: createBooking.error,
      });
    }

    const idTransaction = createBooking.data.id;

    let date = new Date();
    let createDate = moment(date).format("yyyyMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require("config");

    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");
    let orderId = moment(date).format("DDHHmmss");
    // let amount = req.body.amount || 100000;
    // let bankCode = "NCB";

    let locale = "vn";
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = idTransaction;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + idTransaction;
    vnp_Params["vnp_OrderType"] = "Thanh toan VNPAY";
    vnp_Params["vnp_Amount"] = 12345678;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    // vnp_Params["vnp_BankCode"] = bankCode;
    // if (bankCode !== null && bankCode !== "") {
    // }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });

    let crypto = require("crypto");

    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return res.status(200).json({
      statusCode: 0,
      message: "Đã tạo thanh toán",
      data: {
        url: vnpUrl,
      },
    });
  }

  async vnpay_return(req, res) {
    let config = require("config");
    let querystring = require("qs");
    let crypto = require("crypto");

    var vnp_Params = req.query;
    console.log("vnp_Params", vnp_Params);
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    var secretKey = config.get("vnp_HashSecret");

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    const bookingId = vnp_Params["vnp_TxnRef"];

    if (secureHash == signed) {
      var rspCode = vnp_Params["vnp_ResponseCode"];

      const getBookingInfo = await bookingServices.getBookingById(bookingId);

      if (getBookingInfo.statusCode != 0) {
        return res.status(401).json(getBookingInfo);
      }

      if (rspCode != "00") {
        const cancelBooking = await bookingServices.updateBookingByStaff(
          bookingId,
          null,
          "Đã huỷ"
        );
        if (cancelBooking.statusCode != 0) {
          return res.status(401).json(cancelBooking);
        }

        return res.status(200).json({
          statusCode: 1,
          message: "Thanh toán thất bại, vui lòng thanh toán lại",
        });
      }

      const confirmBooking = await bookingServices.updateBookingByStaff(
        bookingId,
        null,
        "Đã thanh toán"
      );
      if (confirmBooking.statusCode != 0) {
        return res.status(401).json(confirmBooking);
      }

      const isSentEmail = await sendEmailUpdateTicketStatus(bookingId);

      if (!isSentEmail) {
        return res.status(401).json({
          statusCode: 1,
          message: "Gửi email tới người dùng thất bại",
        });
      }

      return res.status(200).json({
        statusCode: 0,
        message: "Thanh toán đơn đặt vé thành công",
        data: getBookingInfo.data,
      });
    } else {
      const cancelBooking = await bookingServices.updateBookingByStaff(
        bookingId,
        null,
        "Đã huỷ"
      );
      if (cancelBooking.statusCode != 0) {
        return res.status(401).json(cancelBooking);
      }
      return res.status(500).json({
        statusCode: 2,
        message:
          "Thanh toán không thành công do giao dịch đã bị huỷ hoặc gặp lỗi",
      });
    }
  }
}
export default new PaymentController();
