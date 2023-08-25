import db from "../app/models";
import bcrypt from "bcrypt";
const saltRounds = 10;

class UserServices {
  async createUser({ fullName, email, phone, password, address, sex }) {
    try {
      const emailExisted = await db.User.findOne({ where: { email } });
      if (emailExisted)
        return {
          statusCode: 2,
          message: "Email already exists.",
        };

      const passwordHash = await bcrypt.hash(password, saltRounds);
      if (!passwordHash) {
        return {
          statusCode: 3,
          message: "Hash password failed.",
        };
      }
      const userDoc = await db.User.create({
        fullName,
        email,
        password: passwordHash,
        phone,
        address,
        sex,
      });

      if (userDoc) {
        return {
          statusCode: 0,
          message: "Register user successfully.",
          user: userDoc,
        };
      } else {
        return {
          statusCode: 4,
          message: "Register user failed.",
        };
      }
    } catch (error) {
      return {
        statusCode: 5,
        message: "Something went wrong at create user",
      };
    }
  }

  async getUserById({ id }) {
    try {
      const userDoc = await db.User.findByPk(id, {
        raw: true,
        attributes: { exclude: ["password"] },
      });
      if (!userDoc) {
        return {
          statusCode: 1,
          message: "User does not exist",
        };
      }

      return {
        statusCode: 0,
        message: "Get user successfully",
        data: userDoc,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Something went wrong at getUserById",
      };
    }
  }
}

export default new UserServices();
