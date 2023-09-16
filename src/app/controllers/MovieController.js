import { movieServices } from "../../services";
import S3Controller from "./S3Controller";

class MovieController {
  async handleCreateMovie(req, res, next) {
    const {
      title,
      description,
      ageRequire,
      releaseDate,
      endDate,
      duration,
      language,
      country,
      subtitle,
      directors,
      price,
      actors,
      genre,
    } = req.body;
    const files = req.files;

    if (
      !title ||
      !description ||
      !ageRequire ||
      !releaseDate ||
      !endDate ||
      !duration ||
      !language ||
      !country ||
      !price ||
      !subtitle ||
      !directors ||
      !actors ||
      !genre
    ) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu dữ liệu ",
      });
    }

    try {
      const checkMovie = await movieServices.checkMovieExist({ title });
      if (checkMovie.statusCode !== 0) {
        return res.status(401).json(checkMovie);
      }

      let imageData;
      if (files.length > 0) {
        const imgUpload = await S3Controller.handleUploadImages(files);
        if (imgUpload.statusCode === 0) {
          imageData = imgUpload.data;
        } else {
          return imgUpload;
        }
      }

      const response = await movieServices.createMovie({
        title,
        description,
        ageRequire,
        releaseDate,
        endDate,
        price,
        duration,
        language,
        country,
        subtitle,
        directors,
        actors,
        genre,
        imageData,
      });

      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(401).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleCreateMovie",
      });
    }
  }

  async handleGetAllMovies(req, res, next) {
    try {
      const { isCount } = req.query;
      const response = await movieServices.getAllMovies({ isCount });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleGetAllMovies",
      });
    }
  }

  async handleGetLimitMovies(req, res, next) {
    const { page, limit } = req.query;

    if (!page && !limit) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu dữ liệu ",
      });
    }
    try {
      const response = await movieServices.getLimitMovies({ page, limit });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetLimitMovies",
      });
    }
  }

  async handleSearchMovieByTile(req, res, next) {
    const { title, page, limit } = req.query;

    if (!title && !page && !limit) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu dữ liệu ",
      });
    }
    try {
      const response = await movieServices.searchMovieByTitle({
        title,
        page,
        limit,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleSearchMovieByTile",
      });
    }
  }
}

export default new MovieController();
