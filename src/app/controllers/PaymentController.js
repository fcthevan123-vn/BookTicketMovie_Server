import moment from "moment";

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
    // const dataBooking = req.dataBooking;

    // console.log("dataBooking", dataBooking);
    // if (!(dataBooking && dataBooking.statusCode === 0)) {
    //   return res.status(500).json({
    //     statusCode: 500,
    //     msg: `Đã có lỗi xảy ra vui lòng thử lại.`,
    //   });
    // }

    // const { data } = dataBooking;

    const idTransaction = Math.floor(Math.random() * 123456789);

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
      statusCode: 200,
      msg: "Đã tạo thanh toán",
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
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    var secretKey = config.get("vnp_HashSecret");

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    // console.log("signed", signed);
    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];

      const updateBooking = await userServices.updateStatusBooking({
        status: "CU2",
        bookingId: orderId,
        sendEmail: true,
      });

      if (updateBooking.statusCode == 0) {
        return res.status(200).json({
          statusCode: 200,
          msg: "Đơn hàng đã được thanh toán thành công.",
          data: updateBooking.data,
        });
      } else {
        return res.status(updateBooking.statusCode).json({
          statusCode: updateBooking.statusCode,
          msg: "Đơn hàng đã bị xóa hoặc không tìm thấy.",
        });
      }
    } else {
      return res.status(500).json({
        statusCode: 500,
        msg: "Đã có lỗi xãy ra. Dữ liệu đã bị thay đổi.",
      });
    }
  }
}
export default new PaymentController();
