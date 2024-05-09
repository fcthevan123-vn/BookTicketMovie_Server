import { notificationServices } from "../../services";

class NotificationController {
  async hanldeCreateNotification(req, res) {
    try {
      const { userId, message, title, linkNotification, typeNotification } =
        req.body;
      const response = await notificationServices.createNotification({
        userId,
        message,
        title,
        linkNotification,
        typeNotification,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại hanldeCreateNotification",
      });
    }
  }

  async handleGetAllNoti(req, res) {
    try {
      const { userId } = req.query;
      const response = await notificationServices.getAllNotification({
        userId,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleGetAllNoti",
      });
    }
  }

  async handleReadNotification(req, res) {
    try {
      const { userId } = req.query;
      const response = await notificationServices.getAllNotification({
        userId,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleGetAllNoti",
      });
    }
  }
}

export default new NotificationController();
