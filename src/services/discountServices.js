import { Op, where } from "sequelize";
import db, { sequelize } from "../app/models";

class DiscountServices {
  async createDiscount({ data }) {
    try {
      const disCountExisted = await db.Discount.findOne({
        where: {
          nameDiscount: data.nameDiscount,
        },
      });

      if (disCountExisted) {
        return {
          statusCode: 1,
          message: "Mã giảm giá đã bị trùng, vui lòng chọn tên khác",
        };
      }

      const discountDoc = await db.Discount.create(data);

      if (!discountDoc) {
        return {
          statusCode: 2,
          message: "Tạo mã giảm giá thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo mã giảm giá thành công",
        data: data,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 3,
        message: "Có lỗi xảy ra khi createDiscount",
      };
    }
  }

  async updateDiscount({ data }) {
    try {
      const disCountExisted = await db.Discount.findOne({
        where: {
          id: data.id,
        },
      });

      if (!disCountExisted) {
        return {
          statusCode: 1,
          message: "Mã giảm giá không tồn tại",
        };
      }

      if (disCountExisted.nameDiscount != data.nameDiscount) {
        const checkExistedNameDiscount = await db.Discount.findOne({
          where: {
            nameDiscount: data.nameDiscount,
          },
        });

        if (checkExistedNameDiscount) {
          return {
            statusCode: 3,
            message: "Tên mã giảm giá đã bị trùng, vui lòng chọn tên khác",
          };
        }
      }

      await disCountExisted.update(data);

      if (!disCountExisted) {
        return {
          statusCode: 2,
          message: "Cập nhật mã giảm giá thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật mã giảm giá thành công",
        data: disCountExisted,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra khi updateDiscount",
      };
    }
  }

  async getAllDiscount() {
    try {
      const discountDoc = await db.Discount.findAll();

      return {
        statusCode: 0,
        message: "Thành công",
        data: discountDoc,
      };
    } catch (error) {
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra khi getAllDiscount",
      };
    }
  }

  async getDiscountById(id) {
    try {
      const discountDoc = await db.Discount.findByPk(id);

      return {
        statusCode: 0,
        message: "Thành công",
        data: discountDoc,
      };
    } catch (error) {
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra khi getDiscountById",
      };
    }
  }

  async deleteDiscount(id) {
    try {
      const disCountExisted = await db.Discount.findOne({
        where: {
          id: id,
        },
      });

      if (!disCountExisted) {
        return {
          statusCode: 1,
          message: "Mã giảm giá không tồn tại",
        };
      }

      await disCountExisted.destroy();

      return {
        statusCode: 0,
        message: "Xoá mã giảm giá thành công",
      };
    } catch (error) {
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra khi deleteDiscount",
      };
    }
  }

  async checkValidDiscount(nameDiscount) {
    try {
      const currentDate = new Date();

      const discountDoc = await db.Discount.findOne({
        where: {
          nameDiscount: nameDiscount,
          quantity: {
            [Op.gt]: "0",
          },
          startDate: {
            [Op.lte]: currentDate,
          },
          endDate: {
            [Op.gte]: currentDate,
          },
        },
      });

      if (discountDoc) {
        return {
          statusCode: 0,
          isValid: true,
          message: "Thành công",
          data: discountDoc,
        };
      }

      return {
        statusCode: 0,
        isValid: false,
        message: "Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng",
      };
    } catch (error) {
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra khi deleteDiscount",
        error: error.message,
      };
    }
  }

  async decreaseDiscountQuantity(nameDiscount) {
    try {
      const discountDoc = await db.Discount.findOne({
        where: {
          nameDiscount: nameDiscount,
        },
      });

      const decreasetResult = await discountDoc.decrement("quantity", {
        by: 1,
      });

      if (!decreasetResult) {
        return {
          statusCode: 1,
          message: "Đã có lỗi xảy ra",
        };
      }

      return {
        statusCode: 0,
        message: "Thành công",
        data: decreasetResult,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra khi decreaseDiscountQuantity",
        error: error.message,
      };
    }
  }

  async increaseDiscountQuantity(discountId) {
    try {
      const discountDoc = await db.Discount.findOne({
        where: {
          id: discountId,
        },
      });

      const increasetResult = await discountDoc.increment("quantity", {
        by: 1,
      });

      if (!increasetResult) {
        return {
          statusCode: 1,
          message: "Đã có lỗi xảy ra",
        };
      }

      return {
        statusCode: 0,
        message: "Thành công",
      };
    } catch (error) {
      return {
        statusCode: 4,
        message: "Có lỗi xảy ra khi increaseDiscountQuantity",
        error: error.message,
      };
    }
  }
}

export default new DiscountServices();
