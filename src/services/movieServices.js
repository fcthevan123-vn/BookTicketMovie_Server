import S3Controller from "../app/controllers/S3Controller";
import db from "../app/models";
// eslint-disable-next-line no-undef
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

  async editMovie({
    id,
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
    imagesDelete,
  }) {
    try {
      const movieExisted = await db.Movie.findOne({ where: { id } });
      if (!movieExisted)
        return {
          statusCode: 2,
          message: "Phim này không tồn tại",
        };

      let imageMerge;

      if (imagesDelete) {
        imageMerge = movieExisted.images.filter(
          (image) => !imagesDelete.includes(image.imageName)
        );
      } else {
        imageMerge = movieExisted.images;
      }

      const movieDoc = await db.Movie.update(
        {
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
          images: [...imageMerge, ...imageData],
          countBooked: 0,
        },
        {
          where: {
            id: id,
          },
        }
      );

      if (movieDoc) {
        return {
          statusCode: 0,
          message: "Sửa phim thành công",
          data: movieDoc,
        };
      } else {
        return {
          statusCode: 1,
          message: "Sửa phim thất bại",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra khi sửa phim",
      };
    }
  }

  async deleteMovie({ id }) {
    try {
      const movieExisted = await db.Movie.findOne({ where: { id } });
      if (!movieExisted) {
        return {
          statusCode: 1,
          message: "Phim này không tồn tại",
        };
      }

      let imagesToDelete = [];
      if (movieExisted.images.length > 0) {
        imagesToDelete = movieExisted.images.map((img) => img.imageName);
      }

      await movieExisted.destroy();

      await S3Controller.handleDelteImages(imagesToDelete);
      return {
        statusCode: 0,
        message: "Xoá phim thành công",
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi deleteMovie",
      };
    }
  }

  async getTrendingMovie() {
    try {
      const trendingMovie = await db.Movie.findAll({
        where: {
          [Op.and]: {
            endDate: {
              [Op.gte]: new Date(),
            },
            releaseDate: {
              [Op.lte]: new Date(),
            },
          },
        },
        order: [["countBooked", "DESC"]],
        limit: 5,
      });
      if (!trendingMovie) {
        return {
          statusCode: 1,
          message: "Phim rỗng",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy danh sách phim thành công",
        data: trendingMovie,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getTrendingMovie",
      };
    }
  }

  async getActiveMovies() {
    try {
      const activeMovies = await db.Movie.findAll({
        where: {
          [Op.and]: {
            endDate: {
              [Op.gte]: new Date(),
            },
            releaseDate: {
              [Op.lte]: new Date(),
            },
          },
        },
      });
      if (!activeMovies) {
        return {
          statusCode: 1,
          message: "Phim rỗng",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy danh sách phim thành công",
        data: activeMovies,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getActiveMovies",
      };
    }
  }

  async getNextMovies() {
    try {
      const nextMovies = await db.Movie.findAll({
        where: {
          releaseDate: {
            [Op.gt]: new Date(),
          },
        },
      });
      if (!nextMovies) {
        return {
          statusCode: 1,
          message: "Phim rỗng",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy danh sách phim thành công",
        data: nextMovies,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getNextMovies",
      };
    }
  }

  async getMovieById({ id }) {
    try {
      const movieDoc = await db.Movie.findOne({
        where: {
          id: id,
        },
      });
      if (!movieDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy phim",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy dữ liệu phim thành công",
        data: movieDoc,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getMovieById",
      };
    }
  }
}

export default new movieServices();
