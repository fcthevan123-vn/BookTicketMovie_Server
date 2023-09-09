import jwt from "jsonwebtoken";
import multer from "multer";

// error handler
export function handleError(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
}

// Check cookies
export function authorizationToken(req, res, next) {
  try {
    const accessToken = req.cookies.token;
    if (!accessToken) {
      return res.status(400).json({
        statusCode: 3,
        message: "Token không hợp lệ",
      });
    }

    const tokenJWT = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("tokenJWT", tokenJWT);
    if (!tokenJWT) {
      return res.status(400).json({
        statusCode: 2,
        message: "Đã có lỗi khi tạo token",
      });
    }

    req.user = {
      id: tokenJWT.userId,
    };

    next();
  } catch (error) {
    console.log("error", error);
    return res.status(403).json({
      statusCode: 1,
      message: "Đã có lỗi xảy ra tại authorizationToken ",
    });
  }
}

export function authorizationAdmin(req, res, next) {
  try {
    const accessToken = req.cookies.token;

    if (!accessToken) {
      return res.status(400).json({
        statusCode: 3,
        message: "Token không hợp lệ",
      });
    }

    const tokenJWT = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!tokenJWT) {
      return res.status(400).json({
        statusCode: 2,
        message: "Đã có lỗi khi tạo token",
      });
    }

    if (tokenJWT.type != "admin") {
      return res.status(400).json({
        statusCode: 2,
        message: "Bạn không phải là admin",
      });
    }

    req.user = {
      id: tokenJWT.userId,
    };

    next();
  } catch (error) {
    console.log("error", error);
    return res.status(403).json({
      statusCode: 1,
      message: "Đã có lỗi xảy ra tại authorizationAdmin ",
    });
  }
}

// multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;
