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
    const authorizationToken = req.headers.authorization.split(" ")[1];
    if (!authorizationToken) {
      return res.status(400).json({
        message: "Invalid authorization token",
      });
    }

    const tokenJWT = jwt.verify(
      authorizationToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!tokenJWT) {
      return res.status(400).json({
        message: "Something error when create token",
      });
    }

    res.tokenJWT = tokenJWT;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Error at authorizationToken ",
    });
  }
}
