import cinemaServices from "../../services/cinemaServices";

class CinemaController {
  async handleCreateCinema(req, res) {
    const {
      name,
      location,
      detailLocation,
      userId,
      hotline,
      status,
      locationName,
    } = req.body;
    if (!name || !location || !detailLocation || !userId) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }

    const file = req.files;

    try {
      const response = await cinemaServices.createCinema({
        name,
        location,
        detailLocation,
        userId,
        hotline,
        locationName,
        status,
        file,
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
    const data = req.body;

    console.log("data", data);

    const file = req.files;

    try {
      const response = await cinemaServices.updateCinema(
        {
          data,
        },
        file
      );
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

  async handleGetCinemaByStaff(req, res) {
    const { staffId } = req.query;
    try {
      const response = await cinemaServices.getCinemaByStaff(staffId);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetCinemaByStaff",
        err: error.message,
      });
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

  async handleGetAllCinemasByQuery(req, res) {
    const data = req.body;

    try {
      const response = await cinemaServices.getAllCinemaByQuery(
        data.city,
        data.district,
        data.selectedDate,
        data.cinema,
        data.movieId
      );
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetAllCinemasByQuery",
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

  async hanldeSearchCinema(req, res) {
    const { city, district, name } = req.body;

    try {
      const response = await cinemaServices.searchCinema(city, district, name);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại hanldeSearchCinema",
      });
    }
  }
}

export default new CinemaController();
