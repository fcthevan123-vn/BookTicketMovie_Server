import { authenticateServices, userServices } from "../../services";

class AuthenticateController {
  async handleLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        statusCode: 1,
        message: "Thiếu địa chỉ email hoặc mật khẩu",
      });
    }

    try {
      const response = await authenticateServices.login({
        email,
        password,
      });

      // console.log("response", response);
      if (response.statusCode === 0) {
        return res
          .cookie("token", response.token, {
            sameSite: "strict",
            secure: false,
            httpOnly: true,
            path: "/",
            expiresIn: response.expiresIn,
          })
          .status(200)
          .json({
            statusCode: response.statusCode,
            message: response.message,
          });
      }
      return res
        .cookie("token", response.token, {
          sameSite: "strict",
          secure: false,
          httpOnly: true,
          path: "/",
          expiresIn: response.expiresIn,
        })
        .status(400)
        .json({
          statusCode: response.statusCode,
          message: response.message,
        });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại đăng nhập", err: error.message });
    }
  }

  async handleGetProfile(req, res, next) {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({
        statusCode: 1,
        message: "Thiếu id người dùng",
      });
    }
    try {
      const response = await userServices.getUserById({ id });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error at handleGetProfile", err: error.message });
    }
  }

  async handleLogout(req, res, next) {
    try {
      res.cookie("token", "");
      return res
        .status(200)
        .json({ statusCode: 0, message: "Đăng xuất thành công" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error logout.", err: err.message });
    }
  }

  async handleVerifyEmail(req, res, next) {
    const { id } = req.params;
    console.log("first", id);
    if (!id) {
      return res.status(400).json({
        statusCode: 1,
        message: "Thiếu id người dùng",
      });
    }
    try {
      const response = await authenticateServices.verifyEmail({ id });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleVerifyEmail", err: error.message });
    }
  }

  async handleConfirmEmail(req, res, next) {
    const { id } = req.params;
    const { user } = req.query;

    if (!id && !user) {
      return res.status(400).json({
        statusCode: 1,
        message: "Thiếu id người dùng",
      });
    }
    try {
      const response = await authenticateServices.confirmEmail({
        token: id,
        id: user,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleConfirmEmail", err: error.message });
    }
  }
}

export default new AuthenticateController();
