import { roomTypeServices } from "../../services";

class RoomTypeController {
  // Create RoomType Controller
  async handleCreateRoomType(req, res) {
    const { priceMultiplier, name } = req.body;
    if (!priceMultiplier || !name) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await roomTypeServices.createRoomType({
        priceMultiplier,
        name,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleCreateRoomType",
        err: error.message,
      });
    }
  }

  // Read RoomType Controller
  async handleReadRoomType(req, res) {
    const { id } = req.params;
    try {
      const response = await roomTypeServices.readRoomType(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleReadRoomType", err: error.message });
    }
  }

  // Read RoomType Controller
  async handleReadAllRoomType(req, res) {
    try {
      const response = await roomTypeServices.readAllRoomType();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleReadRoomType", err: error.message });
    }
  }

  // Update RoomType Controller
  async handleUpdateRoomType(req, res) {
    const { id } = req.params;
    const { priceMultiplier, name } = req.body;
    try {
      const response = await roomTypeServices.updateRoomType(id, {
        priceMultiplier,
        name,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleUpdateRoomType",
        err: error.message,
      });
    }
  }

  // Delete RoomType Controller
  async handleDeleteRoomType(req, res) {
    const { id } = req.params;
    try {
      const response = await roomTypeServices.deleteRoomType(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleDeleteRoomType",
        err: error.message,
      });
    }
  }
}

export default new RoomTypeController();
