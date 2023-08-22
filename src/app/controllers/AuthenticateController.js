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
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error at handleLogin", err: error.message });
    }
  }

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
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error at handleLogin", err: error.message });
    }
  }

  async handleGetProfile(req, res, next) {
    const { email, userId } = res.tokenJWT;
    if (!email || !userId) {
      return res.status(400).json({
        statusCode: 1,
        message: "Missing email or userId ",
      });
    }
    try {
      const response = await userServices.getUserById({ userId });
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
}

export default new AuthenticateController();
