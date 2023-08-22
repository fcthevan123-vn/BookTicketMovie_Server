import { userServices } from "../../services";

class UserController {
  async handleRegister(req, res, next) {
    const { fullName, email, phone, password, address, sex } = req.body;

    if (!fullName || !email || !phone || !password || !address || !sex) {
      return res.status(401).json({
        statusCode: 1,
        message: "Missing required fields",
      });
    }

    try {
      const response = await userServices.createUser({
        fullName,
        email,
        phone,
        password,
        address,
        sex,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error creating user.", err: error.message });
    }
  }
}

export default new UserController();
