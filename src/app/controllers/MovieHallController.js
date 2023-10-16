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
}

export default new MovieHallController();
