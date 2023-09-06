import db from "../app/models";
import bcrypt from "bcrypt";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class UserServices {
  async createUser({ fullName, email, phone, password, address, sex, age }) {
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
        age,
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

  async updateProfileUser({ id, fullName, phone, address, sex, age }) {
    try {
      const userDoc = await db.User.update(
        {
          fullName,
          phone,
          address,
          sex,
          age,
        },
        {
          where: {
            id: id,
          },
        }
      );

      if (!userDoc) {
        return {
          statusCode: 1,
          message: "User does not exist",
        };
      }

      return {
        statusCode: 0,
        message: "Update successfully",
        data: userDoc,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Something went wrong at updateProfileUser",
      };
    }
  }

  async changePassword({ id, oldPassword, newPassword }) {
    try {
      let userData = await db.User.findByPk(id, {
        raw: true,
      });

      const isComparePassword = await bcrypt.compareSync(
        oldPassword,
        userData.password
      );

      if (!isComparePassword) {
        return {
          statusCode: 1,
          message: `Your password not true, please enter the right password`,
        };
      }

      const hashPassword = bcrypt.hashSync(newPassword, salt);

      try {
        userData = await db.User.update(
          {
            password: hashPassword,
          },
          {
            where: {
              id: id,
            },
          }
        );

        if (userData) {
          return {
            statusCode: 0,
            message: "Change password successfully",
            data: userData,
          };
        }
      } catch (error) {
        return {
          statusCode: 3,
          message: "Something went wrong at updateProfileUser - step2",
        };
      }
    } catch (error) {
      return {
        statusCode: 2,
        message: "Something went wrong at changePassword",
      };
    }
  }
}

export default new UserServices();
