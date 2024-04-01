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

      if (eventExisted)
        return {
          statusCode: 2,
          message: "Sự kiện này đã tồn tại",
        };

      const eventDoc = await db.Movie.create({
        content,
        discount,
        title,
        thumbnail: imageData,
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
          message: "Tạo sự kiện thành công",
          data: eventDoc,
        };
      }
    } catch (error) {
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra tại createEvent",
      };
    }
  }
}

export default new EventServices();
