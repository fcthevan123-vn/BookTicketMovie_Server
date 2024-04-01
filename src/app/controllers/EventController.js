import { validationResult } from "express-validator";
import S3Controller from "./S3Controller";
import { eventServices } from "../../services";

class EventController {
  async handleCreateEvent(req, res) {
    const { content, discount, title, startDate, endDate } = req.body;

    const files = req.files;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: errors.array(),
      });
    }

    try {
      let imageData;
      if (files.length > 0) {
        const imgUpload = await S3Controller.handleUploadImages(files);
        if (imgUpload.statusCode === 0) {
          imageData = imgUpload.data;
        } else {
          return imgUpload;
        }
      }

      const response = await eventServices.createEvent({
        content,
        discount,
        title,
        startDate,
        endDate,
        imageData,
      });

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(401).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleCreateEvent",
      });
    }
  }
}

export default new EventController();
