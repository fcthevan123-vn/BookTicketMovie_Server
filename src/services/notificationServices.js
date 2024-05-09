import db from "../app/models";

class NotificationServices {
  async createNotification({
    userId,
    message,
    title,
    linkNotification,
    typeNotification,
  }) {
    try {
      const notiDoc = await db.Notification.create({
        userId,
        message,
        title,
        linkNotification,
        typeNotification,
      });

      if (!notiDoc) {
        return {
          statusCode: 1,
          message: "Tạo thông báo thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo thành công",
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Có lỗi xảy ra tại createNotification",
      };
    }
  }

  async getAllNotification({ userId }) {
    try {
      const allNoti = await db.Notification.findAll({
        where: {
          userId: userId,
        },
        order: [["createdAt", "DESC"]],
      });

      const { count: unreadCount, rows: unreadNoti } =
        await db.Notification.findAndCountAll({
          where: {
            userId: userId,
            status: "unread",
          },
        });

      return {
        statusCode: 0,
        message: "Lấy thông báo thành công",
        data: {
          allNotification: allNoti,
          unreadNotification: unreadNoti,
          unreadCount,
        },
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Có lỗi xảy ra tại getAllNotification",
      };
    }
  }

  async readNotification(notifications) {
    try {
      for (const notification of notifications) {
        await db.Notification.update(
          { status: "read" },
          {
            where: {
              id: notification.id,
            },
          }
        );
      }

      return {
        statusCode: 0,
        message: "Đọc thông báo thành công",
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Có lỗi xảy ra tại getAllNotification",
      };
    }
  }
}

export default new NotificationServices();
