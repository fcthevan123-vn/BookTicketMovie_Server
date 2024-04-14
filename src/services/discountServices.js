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
}

export default new DiscountServices();
