import db from "../app/models";
import moment from "moment";
class movieServices {
  async createMovie({
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
  }) {
    try {
      const movieExisted = await db.Movie.findOne({ where: { title } });
      if (movieExisted)
        return {
          statusCode: 2,
          message: "Phim này đã tồn tại",
        };

      const movieDoc = await db.Movie.create({
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
        images: imageData,
        countBooked: 0,
      });

      if (movieDoc) {
        return {
          statusCode: 0,
          message: "Tạo phim mới thành công",
          data: movieDoc,
        };
      } else {
        return {
          statusCode: 1,
          message: "Tạo phim mới thất bại",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra khi tạo phim mới",
      };
    }
  }
  async checkMovieExist({ title }) {
    try {
      const movieExisted = await db.Movie.findOne({ where: { title } });
      if (movieExisted)
        return {
          statusCode: 1,
          message: "Phim này đã tồn tại",
        };
      return {
        statusCode: 0,
        message: "Hợp lệ",
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Đã có lỗi xảy ra khi checkMovieExist",
      };
    }
  }

  async getTrendingMovie() {}
}

export default new movieServices();
