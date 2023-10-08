import { validationResult } from "express-validator";
import { movieServices } from "../../services";
import S3Controller from "./S3Controller";

class MovieController {
  async handleCreateMovie(req, res) {
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: errors.array(),
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

  async handleGetAllMovies(req, res) {
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

  async handleGetLimitMovies(req, res) {
    const errors = validationResult(req);
    const { page, limit } = req.query;

    if (!errors.isEmpty()) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: errors.array(),
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

  async handleSearchMovieByTile(req, res) {
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

  async handleEditMovie(req, res) {
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
      imagesDelete,
    } = req.body;
    const files = req.files;
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: errors.array(),
      });
    }

    try {
      let imageData = [];
      if (files.length > 0) {
        const imgUpload = await S3Controller.handleUploadImages(files);
        if (imgUpload.statusCode === 0) {
          imageData = imgUpload.data;
        } else {
          return imgUpload;
        }
      }

      const response = await movieServices.editMovie({
        id,
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
        imagesDelete,
      });

      if (response.statusCode === 0) {
        if (imagesDelete && imagesDelete.length > 0) {
          await S3Controller.handleDelteImages(imagesDelete);
        }
        return res.status(200).json(response);
      } else {
        return res.status(401).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleEditMovie",
      });
    }
  }

  async handleDeleteMovie(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu id",
      });
    }
    try {
      const response = await movieServices.deleteMovie({
        id,
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
        message: "Có lỗi xảy ra tại handleDeleteMovie",
      });
    }
  }

  async handleGetTrendingMovie(req, res) {
    try {
      const response = await movieServices.getTrendingMovie();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetTrendingMovie",
      });
    }
  }

  async handleGetActiveTrending(req, res) {
    try {
      const response = await movieServices.getActiveMovies();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetActiveTrending",
      });
    }
  }

  async handleGetNextMovies(req, res) {
    try {
      const response = await movieServices.getNextMovies();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetNextMovies",
      });
    }
  }

  async handleGetMovieById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu id",
      });
    }
    try {
      const response = await movieServices.getMovieById({ id });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 2,
        message: "Có lỗi xảy ra tại handleGetMovieById",
      });
    }
  }
}

export default new MovieController();
