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
    const dataBooking = req.dataBooking;

    console.log("dataBooking", dataBooking);
    if (!(dataBooking && dataBooking.statusCode === 0)) {
      return res.status(500).json({
        statusCode: 500,
        msg: `Đã có lỗi xảy ra vui lòng thử lại.`,
      });
    }

    const { data } = dataBooking;

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
    vnp_Params["vnp_TxnRef"] = data.id;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + data.id;
    vnp_Params["vnp_OrderType"] = "Thanh toan VNPAY";
    vnp_Params["vnp_Amount"] = data.doctorPrice * 100;
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
}
export default new PaymentController();
