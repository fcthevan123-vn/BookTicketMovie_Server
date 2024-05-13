import S3Controller from "../app/controllers/S3Controller";
import db from "../app/models";
import { searchLikeDeep } from "../middleWares";
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
    language,
    country,
    subtitle,
    directors,
    actors,
    genre,
    trailerLink,
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
        trailerLink,
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
      if (isCount == "true") {
        movieDoc = await db.Movie.count();
      } else {
        movieDoc = await db.Movie.findAll({
          order: [["createdAt", "ASC"]],
        });
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
    language,
    country,
    subtitle,
    directors,
    actors,
    genre,
    imageData,
    trailerLink,
    imagesDelete,
    isUpdateTrailer,
  }) {
    try {
      const movieExisted = await db.Movie.findOne({ where: { id } });
      if (!movieExisted)
        return {
          statusCode: 2,
          message: "Phim này không tồn tại",
        };

      console.log("trailerLink", trailerLink);
      const oldTrailerLink = movieExisted.trailerLink;
      // detele old trailer
      if (isUpdateTrailer == "true" && movieExisted.trailerLink) {
        const convertTrailerLink = movieExisted.trailerLink.substring(
          movieExisted.trailerLink.lastIndexOf("/") + 1
        );
        const deleteOldTrailer = await S3Controller.handleDelteImages([
          convertTrailerLink,
        ]);

        if (deleteOldTrailer.statusCode != 0) {
          return {
            statusCode: 2,
            message: "Có lỗi xảy ra khi xoá trailer",
          };
        }
      }

      let imageMerge;

      if (imagesDelete) {
        imageMerge = movieExisted.images.filter(
          (image) =>
            image !== "https://show-booking.s3.amazonaws.com/" + imagesDelete
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
          directors,
          trailerLink: oldTrailerLink,
          actors,
          genre,
          images: [...imageMerge, ...imageData],
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
        imagesToDelete = movieExisted.images.map((img) => img);
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

      const nextMovies = await db.Movie.findAll({
        where: {
          releaseDate: {
            [Op.gt]: new Date(),
          },
        },
      });

      const trendingMovies = await db.Movie.findAll({
        order: [["countBooked", "DESC"]],
        limit: 4,
      });

      const topBookMovie = await db.Movie.findOne({
        order: [["countBooked", "DESC"]],
      });

      const topStarMovie = await db.Movie.findOne({
        order: [["averageRating", "DESC"]],
      });

      return {
        statusCode: 0,
        cc: "casda",
        message: "Lấy danh sách phim thành công",
        data: {
          activeMovies: activeMovies,
          nextMovies: nextMovies,
          trendingMovies: trendingMovies,
          topMovie: {
            topBookMovie: topBookMovie,
            topStarMovie: topStarMovie,
          },
        },
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

  async getStatistic({ id }) {
    try {
      const movieDoc = await db.Movie.findAll({
        where: {
          id: id,
        },
        include: [
          {
            model: db.Show,
            include: [
              {
                model: db.Booking,
                // where: {
                //   isPaid: true,
                // },
                include: [
                  {
                    model: db.User,
                  },
                ],
              },
            ],
          },
        ],
      });
      if (!movieDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy phim",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy dữ liệu thống kê thành công",
        data: movieDoc,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getStatistic",
      };
    }
  }

  async getAllShowTimeByMovieId() {
    try {
      const showsByMovie = await db.Movie.findAll(
        {
          include: [
            {
              model: db.Show,
              include: [
                {
                  model: db.MovieHall,
                  include: [
                    {
                      model: db.Cinema,
                    },
                    {
                      model: db.RoomType,
                    },
                    {
                      model: db.Layout,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          order: [["createdAt", "ASC"]],
        }
      );

      if (!showsByMovie) {
        return {
          statusCode: 1,
          message: "Có lỗi khi getAllShowTimeByMovieId",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy show thành công",
        data: showsByMovie,
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình lấy dữ liệu getAllShowTimeByMovieId",
      };
    }
  }

  async advanceSearch(
    title,
    ageRequire,
    country,
    genre,
    subtitle,
    status,
    rating,
    page,
    limit
  ) {
    try {
      let whereCondition = {
        title: searchLikeDeep("Movie", "title", title),
      };

      let orderCondition = [["createdAt", "ASC"]];

      // if (ageRequire && parseInt(ageRequire) < 18) {
      //   whereCondition.ageRequire = {
      //     [Op.lt]: 18,
      //   };
      // } else if (ageRequire && parseInt(ageRequire) >= 18) {
      //   whereCondition.ageRequire = {
      //     [Op.gte]: 18,
      //   };
      // }

      if (ageRequire) {
        whereCondition.ageRequire = ageRequire;
      }
      if (rating) {
        orderCondition = [["averageRating", rating]];
      }

      if (subtitle.length > 0) {
        whereCondition.subtitle = {
          [Op.any]: subtitle,
        };
      }

      if (country.length > 0) {
        whereCondition.country = {
          [Op.any]: country,
        };
      }

      const currentDate = new Date();

      console.log("status", status);
      if (status == "Phim đang chiếu") {
        whereCondition.releaseDate = {
          [Op.lte]: currentDate,
        };
        whereCondition.endDate = {
          [Op.gte]: currentDate,
        };
      } else if (status == "Phim sắp chiếu") {
        whereCondition.releaseDate = {
          [Op.gt]: currentDate,
        };
      }
      if (genre.length > 0) {
        whereCondition.genre = {
          [Op.contains]: genre,
        };
      }

      const { count, rows: movieDoc } = await db.Movie.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: orderCondition,
        where: whereCondition,
      });

      return {
        statusCode: 0,
        message: "Lấy dữ liệu thành công",
        data: movieDoc,
        rows: count,
      };
    } catch (error) {
      console.log("error.message", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình lấy dữ liệu advanceSearch",
      };
    }
  }
}

export default new movieServices();
