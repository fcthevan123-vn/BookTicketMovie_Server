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
}

export default new MovieController();
