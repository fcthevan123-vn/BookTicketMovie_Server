import movieHallServices from "../../services/movieHallServices";

class MovieHallController {
  async handleGetAllMovieHall(req, res) {
    try {
      const response = await movieHallServices.getAllMovieHall();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetAllMovieHall",
        err: error.message,
      });
    }
  }

  async handleCreateMovieHall(req, res) {
    const { number, name, roomTypeId, cinemaId, layoutId } = req.body;
    if (!number || !name || !roomTypeId || !cinemaId || !layoutId) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await movieHallServices.createMovieHall({
        number,
        name,
        roomTypeId,
        cinemaId,
        layoutId,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          message: "Có lỗi tại handleCreateMovieHall",
          err: error.message,
        });
    }
  }

  async handleReadMovieHall(req, res) {
    const { id } = req.params;
    try {
      const response = await movieHallServices.readMovieHall(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          message: "Có lỗi tại handleReadMovieHall",
          err: error.message,
        });
    }
  }

  async handleUpdateMovieHall(req, res) {
    const { id } = req.params;
    const { number, name, roomTypeId, cinemaId, layoutId } = req.body;
    try {
      const response = await movieHallServices.updateMovieHall(id, {
        number,
        name,
        roomTypeId,
        cinemaId,
        layoutId,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          message: "Có lỗi tại handleUpdateMovieHall",
          err: error.message,
        });
    }
  }

  async handleDeleteMovieHall(req, res) {
    const { id } = req.params;
    try {
      const response = await movieHallServices.deleteMovieHall(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          message: "Có lỗi tại handleDeleteMovieHall",
          err: error.message,
        });
    }
  }
}

export default new MovieHallController();
