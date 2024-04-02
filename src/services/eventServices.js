import { Op } from "sequelize";
import { S3Controller } from "../app/controllers";
import db from "../app/models";

class EventServices {
  async createEvent({
    content,
    discount,
    title,
    startDate,
    endDate,
    imageData,
  }) {
    try {
      const eventExisted = await db.Event.findOne({
        where: { title },
      });

      const discountExisted = await db.Event.findOne({
        where: { discount },
      });

      if (eventExisted) {
        await S3Controller.handleDelteImages(imageData[0]);

        return {
          statusCode: 2,
          message: "Sự kiện này đã tồn tại",
        };
      }

      if (discountExisted) {
        await S3Controller.handleDelteImages(imageData[0]);

        return {
          statusCode: 4,
          message: "Mã giảm giá này đã tồn tại",
        };
      }

      const eventDoc = await db.Event.create({
        content,
        discount,
        title,
        thumbnail: imageData[0],
        startDate,
        endDate,
      });

      if (eventDoc) {
        return {
          statusCode: 0,
          message: "Tạo sự kiện thành công",
          data: eventDoc,
        };
      } else {
        return {
          statusCode: 1,
          message: "Tạo sự thất bại",
          data: eventDoc,
        };
      }
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra tại createEvent",
      };
    }
  }

  async updateEvent({
    id,
    content,
    discount,
    title,
    startDate,
    endDate,
    imageData,
    thumbnail,
  }) {
    try {
      const eventExisted = await db.Event.findAll({
        where: {
          title: title,
          id: {
            [Op.not]: id,
          },
        },
      });

      const discountExisted = await db.Event.findAll({
        where: {
          discount: discount,
          id: {
            [Op.not]: id,
          },
        },
      });

      if (eventExisted.length > 0) {
        await S3Controller.handleDelteImages(imageData[0]);

        return {
          statusCode: 2,
          data: eventExisted,
          message: "Sự kiện này đã tồn tại, hãy chọn tiêu đề khác",
        };
      }

      if (discountExisted.length > 0) {
        await S3Controller.handleDelteImages(imageData[0]);

        return {
          statusCode: 4,
          message: "Mã giảm giá này đã tồn tại, hãy chọn mã giảm giá khác",
        };
      }

      const eventDoc = await db.Event.update(
        {
          content,
          discount,
          title,
          thumbnail: imageData[0],
          startDate,
          endDate,
        },
        {
          where: {
            id: id,
          },
        }
      );

      if (eventDoc) {
        await S3Controller.handleDelteImages(thumbnail);
        return {
          statusCode: 0,
          message: "Cập nhật sự kiện thành công",
          data: eventDoc,
        };
      } else {
        return {
          statusCode: 1,
          message: "Cập nhật sự kiện thất bại",
          data: eventDoc,
        };
      }
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra tại updateEvent",
      };
    }
  }

  async getAllEvent() {
    try {
      const eventDoc = await db.Event.findAll();

      return {
        statusCode: 0,
        message: "Lấy đữ liệu thành công",
        data: eventDoc,
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Lấy đữ liệu thất bại",
      };
    }
  }

  async deleteEvent({ id }) {
    try {
      const eventExisted = await db.Event.findOne({ where: { id } });
      if (!eventExisted) {
        return {
          statusCode: 1,
          message: "Sự kiện này không tồn tại",
        };
      }

      await eventExisted.destroy();

      await S3Controller.handleDelteImages(eventExisted.thumbnail);

      return {
        statusCode: 0,
        message: "Xoá sự kiện thành công",
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi deleteEvent",
      };
    }
  }
}

export default new EventServices();
