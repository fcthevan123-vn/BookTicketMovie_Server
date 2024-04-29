import { roomTypeServices } from "../../services";

class RoomTypeController {
  // Create RoomType Controller
  async handleCreateRoomType(req, res) {
    const { name, priceNormal, priceHoliday, cinemaId } = req.body;
    try {
      const response = await roomTypeServices.createRoomType({
        name,
        priceNormal,
        priceHoliday,
        cinemaId,
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
    const { staffId } = req.query;
    try {
      const response = await roomTypeServices.getAllRoomType(staffId);
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
    const { id, name, priceNormal, priceHoliday, cinemaId } = req.body;
    try {
      const response = await roomTypeServices.updateRoomType({
        id,
        name,
        priceNormal,
        priceHoliday,
        cinemaId,
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
