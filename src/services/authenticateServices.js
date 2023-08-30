import db from "../app/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthenticateServices {
  async login({ email, password }) {
    try {
      // Validate email and password
      const userExisted = await db.User.findOne({ where: { email } });
      if (!userExisted) {
        return {
          statusCode: 1,
          message: "User does not exist",
        };
      }

      const passwordCheck = await bcrypt.compare(
        password,
        userExisted.password
      );
      if (!passwordCheck) {
        return {
          statusCode: 2,
          message: "Password does not match",
        };
      }

      //   Genarate JWT token
      const data = {
        email: userExisted.email,
        userId: userExisted.id,
      };

      const tokenJWT = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      const expiresIn = Math.floor(new Date().getTime() / 1000);

      if (!tokenJWT) {
        return {
          statusCode: 3,
          message: "Create token failure",
        };
      }

      return {
        statusCode: 0,
        message: "Login successfully",
        token: tokenJWT,
        expiresIn,
      };
    } catch (error) {
      return {
        statusCode: 4,
        message: "Error at login",
      };
    }
  }
}

export default new AuthenticateServices();
