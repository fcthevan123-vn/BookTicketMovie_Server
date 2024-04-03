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

  async handleUpdateEvent(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({
        statusCode: 2,
        message: "Nhập thiếu id",
      });
    }

    const { content, discount, title, startDate, endDate, thumbnail } =
      req.body;

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

      const response = await eventServices.updateEvent({
        id,
        content,
        discount,
        title,
        startDate,
        endDate,
        imageData,
        thumbnail,
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
        message: "Có lỗi xảy ra tại handleUpdateEvent",
      });
    }
  }

  async handleGetAllEvent(req, res) {
    try {
      const response = await eventServices.getAllEvent();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetAllEvent",
      });
    }
  }

  async handleGetOneEvent(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(401).json({
          statusCode: 1,
          message: "Nhập thiếu id",
        });
      }

      const response = await eventServices.getOneEvent(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetOneEvent",
      });
    }
  }

  async handleDeleteEvent(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(401).json({
          statusCode: 1,
          message: "Nhập thiếu id",
        });
      }
      const response = await eventServices.deleteEvent({
        id,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleDeleteEvent",
      });
    }
  }
}

export default new EventController();
