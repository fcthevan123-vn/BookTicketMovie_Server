import db from "../app/models";
import moment from "moment";
const { Op } = require("sequelize");

class movieServices {
  async createMovie({
    title,
    description,
    ageRequire,
    releaseDate,
    endDate,
    duration,
    price,
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
        price,
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

  async getAllMovies({ isCount }) {
    try {
      let movieDoc;
      if (isCount) {
        movieDoc = await db.Movie.count();
      } else {
        movieDoc = await db.Movie.findAll();
      }
      if (movieDoc) {
        return {
          statusCode: 0,
          message: "Lấy dữ liệu thành công",
          data: movieDoc,
        };
      }
    } catch (error) {
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getAllMovie",
      };
    }
  }

  async getLimitMovies({ page, limit }) {
    try {
      const { count, rows: movieDoc } = await db.Movie.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: [["createdAt", "ASC"]],
      });
      if (movieDoc) {
        return {
          statusCode: 0,
          message: "Lấy dữ liệu thành công",
          data: movieDoc,
          rows: count,
        };
      }
    } catch (error) {
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getAllMovie",
      };
    }
  }
  async searchMovieByTitle({ title, page, limit }) {
    try {
      const { count, rows: movieDoc } = await db.Movie.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: [["createdAt", "ASC"]],
        where: {
          title: {
            [Op.iLike]: `%${title}%`,
          },
        },
      });
      if (movieDoc) {
        return {
          statusCode: 0,
          message: "Lấy dữ liệu thành công",
          data: movieDoc,
          rows: count,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi searchMovieByTitle",
      };
    }
  }
}

export default new movieServices();
