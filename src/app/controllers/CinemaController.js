import cinemaServices from "../../services/cinemaServices";

class CinemaController {
  async handleCreateCinema(req, res) {
    const { name, location, detailLocation } = req.body;
    if (!name || !location || !detailLocation) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await cinemaServices.createCinema({
        name,
        location,
        detailLocation,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleCreateCinema", err: error.message });
    }
  }

  async handleUpdateCinema(req, res) {
    const { id, name, location, detailLocation } = req.body;
    if (!id || !name || !location || !detailLocation) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await cinemaServices.updateCinema({
        id,
        name,
        location,
        detailLocation,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleUpdateCinema", err: error.message });
    }
  }

  async handleDeleteCinema(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu id",
      });
    }
    try {
      const response = await cinemaServices.deleteCinema({ id });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleDeleteCinema", err: error.message });
    }
  }

  async handleGetAllCinemas(req, res) {
    try {
      const response = await cinemaServices.getAllCinema();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetAllCinemas",
        err: error.message,
      });
    }
  }

  async handleGetLimitCinemas(req, res) {
    const { page, limit } = req.query;

    if (!page || !limit) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu dữ liệu",
      });
    }
    try {
      const response = await cinemaServices.getLimitCinema({ page, limit });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetLimitCinemas",
      });
    }
  }
}

export default new CinemaController();
