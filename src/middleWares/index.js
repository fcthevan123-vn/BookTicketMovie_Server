import jwt from "jsonwebtoken";
// error handler
export function handleError(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
}

export function authorizationToken(req, res, next) {
  try {
    const accessToken = req.cookies.token;
    console.log("accessToken", accessToken);
    if (!accessToken) {
      return res.status(400).json({
        message: "Invalid authorization token",
      });
    }

    const tokenJWT = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!tokenJWT) {
      return res.status(400).json({
        message: "Something error when create token",
      });
    }

    req.user = {
      id: tokenJWT.userId,
    };

    next();
  } catch (error) {
    console.log("error", error);
    return res.status(403).json({
      message: "Error at authorizationToken ",
    });
  }
}
