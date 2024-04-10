import db from "../app/models";

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

      const discountDoc = await db.Discount.create({
        data,
      });

      if (!discountDoc) {
        return {
          statusCode: 2,
          message: "Tạo mã giảm giá thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo mã giảm giá thành công",
        data: discountDoc,
      };
    } catch (error) {
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

      await disCountExisted.update({ data });

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
      return {
        statusCode: 3,
        message: "Có lỗi xảy ra khi createDiscount",
      };
    }
  }
}

export default new DiscountServices();
