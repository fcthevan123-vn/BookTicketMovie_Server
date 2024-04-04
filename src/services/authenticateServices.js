import db from "../app/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../middleWares/nodeMailer";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class AuthenticateServices {
  async login({ email, password }) {
    try {
      // Validate email and password
      const userExisted = await db.User.findOne({ where: { email } });
      if (!userExisted) {
        return {
          statusCode: 1,
          message: "Tài khoản hoặc mật khẩu không chính xác",
        };
      }

      const passwordCheck = await bcrypt.compare(
        password,
        userExisted.password
      );
      if (!passwordCheck) {
        return {
          statusCode: 2,
          message: "Tài khoản hoặc mật khẩu không chính xác ",
        };
      }

      //   Genarate JWT token
      const data = {
        email: userExisted.email,
        userId: userExisted.id,
        type: userExisted.type,
      };

      // eslint-disable-next-line no-undef
      const tokenJWT = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      const expiresIn = Math.floor(new Date().getTime() / 1000);

      if (!tokenJWT) {
        return {
          statusCode: 3,
          message: "Tạo token lỗi",
        };
      }

      const countUpdate = parseInt(userExisted.count) + 1;

      await userExisted.update({ count: countUpdate });

      return {
        statusCode: 0,
        message: "Đăng nhập thành công",
        token: tokenJWT,
        expiresIn,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra tại Login!",
      };
    }
  }

  async verifyEmail({ id }) {
    try {
      const userData = await db.User.findOne({ where: { id } });
      if (!userData) {
        return {
          statusCode: 1,
          message: "Người dùng không tồn tại",
        };
      }

      const hashToken = bcrypt
        .hashSync(userData.tokenVerify, salt)
        .replace(/\//g, "slash");

      const linkVerify = `http://127.0.0.1:5173/verify-email/${hashToken}?user=${userData.id}`;

      sendVerificationEmail(userData.email, linkVerify, userData.fullName);

      return {
        statusCode: 0,
        message: "Gửi email xác nhận thành công",
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi xác nhận email",
      };
    }
  }

  async confirmEmail({ token, id }) {
    try {
      const userData = await db.User.findOne({ where: { id } });
      if (!userData) {
        return {
          statusCode: 1,
          message: "Người dùng không tồn tại",
        };
      }

      const tokenDecrypt = await bcrypt.compare(
        userData.tokenVerify,
        token.replace(/slash/g, "/")
      );

      if (!tokenDecrypt) {
        return {
          statusCode: 3,
          message: "Xác nhận email thất bại",
        };
      }

      const updateUser = await db.User.update(
        {
          isVerifyEmail: true,
          tokenVerify: null,
        },
        {
          where: {
            id: id,
          },
        }
      );

      if (!updateUser) {
        return {
          statusCode: 4,
          message: "Xác nhận email thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Xác nhận email thành công",
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi xác nhận email",
      };
    }
  }
}

export default new AuthenticateServices();
