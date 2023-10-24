import { showServices } from "../../services";

class ShowController {
  async handleGetShowByMovieId(req, res) {
    const { movieId, roomTypeId, date, locationCode } = req.query;
    if (!movieId || !roomTypeId || !date || !locationCode) {
      console.log("req.body", req.body);
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      let data;
      if (roomTypeId === "all") {
        const response =
          await showServices.getSeatStatusOfShowsByMovieIdAndAllRoomType(
            movieId,
            date,
            locationCode
          );
        data = response;
      } else {
        const response = await showServices.getSeatStatusOfShowsByMovieId(
          movieId,
          roomTypeId,
          date,
          locationCode
        );

        data = response;
      }
      if (data.statusCode === 0) {
        return res.status(200).json(data);
      }
      return res.status(400).json(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleCreateCinema", err: error.message });
    }
  }
}

export default new ShowController();
