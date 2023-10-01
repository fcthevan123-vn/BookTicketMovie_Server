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
          message: "Email đã tồn tại",
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
          message: "Đăng ký tài khoản thành công",
          user: userDoc,
        };
      } else {
        return {
          statusCode: 4,
          message: "Đăng ký tài khoản thất bại",
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

  async getAllUserByRule({ page, limit }) {
    try {
      const { count, rows: userDoc } = await db.User.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: [["createdAt", "ASC"]],
      });
      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Có lỗi xảy ra",
        };
      }

      return {
        statusCode: 0,
        message: "Get user thành công",
        data: userDoc,
        rows: count,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại getAllUserByRule",
      };
    }
  }

  async updateProfileUser({ id, fullName, phone, address, sex, age, email }) {
    try {
      let userDoc;
      if (email.length > 0) {
        userDoc = await db.User.update(
          {
            fullName,
            phone,
            address,
            sex,
            age,
            email,
          },
          {
            where: {
              id: id,
            },
          }
        );
      } else {
        userDoc = await db.User.update(
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
      }

      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Người dùng không tồn tại",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật người dùng thành công",
        data: userDoc,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại updateProfileUser",
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
