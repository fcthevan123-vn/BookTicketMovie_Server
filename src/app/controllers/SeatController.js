import { seatServices } from "../../services";

class SeatController {
  async handleGetAllSeatByShowId(req, res) {
    try {
      const { id } = req.params;
      const response = await seatServices.getSeatOverviewByShowId(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleGetAllSeatByShowId",
      });
    }
  }

  async handleGetAllSeatType(req, res) {
    try {
      const { staffId } = req.query;
      const response = await seatServices.getAllSeatType(staffId);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleGetAllSeatByShowId",
      });
    }
  }

  async handleCreateSeatType(req, res) {
    try {
      const { color, staffId, name, price } = req.body;
      const response = await seatServices.creatSeatType({
        color,
        staffId,
        name,
        price,
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
        message: "Có lỗi xảy ra tại handleGetAllSeatByShowId",
      });
    }
  }
}

export default new SeatController();
