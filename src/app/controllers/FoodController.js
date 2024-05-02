import { foodServices } from "../../services";
import S3Controller from "./S3Controller";

class FoodController {
  async handleCreateFood(req, res) {
    const { name, price, status } = req.body;
    const files = req.files;

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

      const response = await foodServices.createFood({
        name,
        price,
        image: imageData[0],
        status,
      });

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleCreateFood", err: error.message });
    }
  }

  async handleUpdateFood(req, res) {
    const { id, name, price, status } = req.body;
    const files = req.files;

    try {
      let imageData = null;

      if (files) {
        const imgUpload = await S3Controller.handleUploadImages(files);
        if (imgUpload.statusCode === 0) {
          imageData = imgUpload.data[0];
        } else {
          return imgUpload;
        }
      }

      console.log("imageData", imageData);

      const response = await foodServices.updateFood({
        id,
        name,
        price,
        image: imageData,
        status,
      });

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleCreateFood", err: error.message });
    }
  }

  async handleGetFood(req, res) {
    const { status } = req.query;

    try {
      const response = await foodServices.getAllFood(status);

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleGetFood", err: error.message });
    }
  }

  async handleChangeStatus(req, res) {
    const { status, id } = req.query;

    try {
      const response = await foodServices.changeStatusFood({ status, id });

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleChangeStatus", err: error.message });
    }
  }
}

export default new FoodController();
