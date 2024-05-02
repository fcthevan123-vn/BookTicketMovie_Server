import db from "../app/models";
import bcrypt from "bcrypt";
// eslint-disable-next-line no-undef
const { Op } = require("sequelize");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class UserServices {
  async createUser({
    fullName,
    email,
    phone,
    password,
    address,
    sex,
    age,
    type,
  }) {
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

      let userDoc;

      if (type && type.length > 0) {
        userDoc = await db.User.create({
          fullName,
          email,
          password: passwordHash,
          phone,
          address,
          sex,
          age,
          type,
        });
      } else {
        userDoc = await db.User.create({
          fullName,
          email,
          password: passwordHash,
          phone,
          address,
          sex,
          age,
        });
      }

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
      console.log("error", error);
      return {
        statusCode: 5,
        message: "Có lỗi xảy ra tại createUser",
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

  async deleteUserById({ id }) {
    try {
      console.log("id-----------------", id);
      const checkIsEmployee = await db.Cinema.findOne({
        where: {
          userId: id,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });

      if (checkIsEmployee) {
        return {
          statusCode: 1,
          message: `${checkIsEmployee.User.fullName} đang làm nhân viên quản lý tại ${checkIsEmployee.name}. Vui lòng đổi nhân viên quản lý khác và thực hiện lại hành động`,
        };
      }

      const userExisted = await db.User.findOne({ where: { id } });
      if (!userExisted) {
        return {
          statusCode: 1,
          message: "Người dùng không tồn tại",
        };
      }

      await db.User.destroy({
        where: { id: id },
      });

      return {
        statusCode: 0,
        message: "Xoá tài khoản thành công",
        data: userExisted,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi deleteUserById",
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

  async updateProfileUser({
    id,
    fullName,
    phone,
    address,
    sex,
    age,
    email,
    type,
  }) {
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
            type,
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
      console.log(error);
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
          message: `Mật khẩu không chính xác`,
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
            message: "Đổi mật khẩu thành công",
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

  async searchUser({ name, page, limit }) {
    try {
      const { count, rows: userDoc } = await db.User.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: [["createdAt", "ASC"]],
        where: {
          [Op.or]: [
            {
              fullName: {
                [Op.iLike]: `%${name}%`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${name}%`,
              },
            },
            {
              address: {
                [Op.iLike]: `%${name}%`,
              },
            },
          ],
        },
      });

      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy người dùng phù hợp",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy người dùng phù hợp",
        data: userDoc,
        rows: count,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm kiếm người dùng",
      };
    }
  }

  async statisticUser() {
    try {
      const { rows: userMaleDoc } = await db.User.findAndCountAll({
        // order: [["createdAt", "ASC"]],
        where: {
          sex: 0,
        },
      });

      const { rows: userFemaleDoc } = await db.User.findAndCountAll({
        // order: [["createdAt", "ASC"]],
        where: {
          sex: 1,
        },
      });

      if (!userMaleDoc || !userFemaleDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy người dùng phù hợp",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy người dùng phù hợp",
        data: {
          countMale: userMaleDoc.length,
          countFemale: userFemaleDoc.length,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm kiếm người dùng",
      };
    }
  }
  async statisticUserRegister() {
    try {
      const data = [];
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(today);
        const weekEnd = new Date(today);
        weekStart.setDate(today.getDate() - 7 * (i + 1));
        weekEnd.setDate(today.getDate() - 7 * i);

        const userCount = await db.User.count({
          where: {
            createdAt: {
              [Op.between]: [weekStart, weekEnd],
            },
          },
        });

        data.push({
          name: `Tuần ${5 - i}`,
          "Người dùng": userCount,
        });
      }

      return {
        statusCode: 0,
        message: "Tìm thấy người dùng phù hợp",
        data: data.reverse(),
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm kiếm người dùng",
      };
    }
  }

  async searchUserByType(type) {
    try {
      const userDoc = await db.User.findAll({
        where: {
          type: type,
        },
      });

      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Có lỗi xảy ra",
        };
      }

      const convertData = userDoc.map((user) => {
        return {
          value: user.id,
          label: `${user.fullName} - ${user.email}`,
        };
      });

      return {
        statusCode: 0,
        message: "Get user thành công",
        data: userDoc,
        convertData: convertData,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại getAllUserByRule",
      };
    }
  }
}
export default new UserServices();
