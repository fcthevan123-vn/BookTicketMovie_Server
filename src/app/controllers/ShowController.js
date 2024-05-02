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

  async handleCreateShow(req, res) {
    const {
      movieId,
      date,
      movieHallId,
      startTime,
      endTime,
      timeCheckEnd,
      timeCheckStart,
    } = req.body;
    if (!movieId || !movieHallId || !date || !startTime || !endTime) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }

    try {
      const response = await showServices.createShow({
        movieId,
        date,
        movieHallId,
        startTime,
        timeCheckEnd,
        timeCheckStart,
        endTime,
      });

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleCreateShow", err: error.message });
    }
  }

  async handleDeleteShow(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }

    try {
      const response = await showServices.deleteShow(id);

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleDeleteShow", err: error.message });
    }
  }

  async handleGetShowByCinema(req, res) {
    const { staffId } = req.query;
    console.log("staffId", staffId);

    try {
      const response = await showServices.getShowByCinema(staffId);

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi tại handleGetShowByCinema",
        err: error.message,
      });
    }
  }
}

export default new ShowController();
