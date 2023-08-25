import { authenticateServices, userServices } from "../../services";

class AuthenticateController {
  async handleLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        statusCode: 1,
        message: "Missing password or email ",
      });
    }

    try {
      const response = await authenticateServices.login({
        email,
        password,
      });

      console.log("response", response);

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
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error at handleLogin", err: error.message });
    }
  }

  async handleGetProfile(req, res, next) {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({
        statusCode: 1,
        message: "Missing email or userId ",
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
        .json({ statusCode: 0, message: "Logout successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error logout.", err: err.message });
    }
  }
}

export default new AuthenticateController();
