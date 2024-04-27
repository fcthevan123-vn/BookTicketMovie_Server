import { Op } from "sequelize";
import db from "../app/models";
import showServices from "./showServices";

class CinemaServices {
  async createCinema({
    name,
    location,
    detailLocation,
    userId,
    hotline,
    status,
    imageLink,
  }) {
    try {
      const checkUserValid = await db.Cinema.findOne({
        where: {
          userId: userId,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });

      if (checkUserValid) {
        return {
          statusCode: 1,
          message: `${checkUserValid.User.fullName} đã quản lý ${checkUserValid.name}, vui lòng chọn người khác`,
        };
      }

      const cinema = await db.Cinema.create({
        name,
        location,
        detailLocation,
        userId,
        hotline,
        status,
        image: imageLink[0],
      });

      return {
        statusCode: 0,
        message: "Tạo rạp phim thành công",
        data: cinema,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tạo rạp phim",
      };
    }
  }

  async updateCinema({ id, name, location, detailLocation }) {
    try {
      const cinema = await db.Cinema.findOne({ where: { id } });
      if (!cinema) {
        return {
          statusCode: 1,
          message: "Rạp phim không tồn tại",
        };
      }

      cinema.name = name;
      cinema.location = location;
      cinema.detailLocation = detailLocation;
      await cinema.save();

      return {
        statusCode: 0,
        message: "Cập nhật rạp phim thành công",
        data: cinema,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi cập nhật rạp phim",
      };
    }
  }

  async deleteCinema({ id }) {
    try {
      const cinema = await db.Cinema.findOne({ where: { id } });
      if (!cinema) {
        return {
          statusCode: 1,
          message: "Rạp phim không tồn tại",
        };
      }

      await db.Cinema.destroy({
        where: { id },
      });

      return {
        statusCode: 0,
        message: "Xóa rạp phim thành công",
        data: cinema,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi xóa rạp phim",
      };
    }
  }

  async getAllCinema() {
    try {
      const cinemas = await db.Cinema.findAll({
        include: [
          {
            model: db.MovieHall,
            include: [{ model: db.RoomType }, { model: db.Layout }],
          },
        ],
        nest: true,
      });

      return {
        statusCode: 0,
        message: "Lấy danh sách rạp phim thành công",
        data: cinemas,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi lấy danh sách rạp phim",
      };
    }
  }

  async getAllCinemaByQuery(city, district, selectedDate, cinema, movieId) {
    try {
      let cinemasHaveShows;
      if (district == "-1") {
        cinemasHaveShows = await db.Cinema.findAll(
          {
            where: {
              location: { [Op.contains]: [city] },
            },
            include: [
              {
                model: db.MovieHall,
                include: [
                  {
                    model: db.Show,
                    where: {
                      movieId: movieId,
                      date: {
                        [Op.eq]: selectedDate,
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            nest: true,
          }
        );
      } else {
        cinemasHaveShows = await db.Cinema.findAll(
          {
            where: {
              location: { [Op.contains]: [city, district] },
            },
            include: [
              {
                model: db.MovieHall,
                include: [
                  {
                    model: db.Show,
                    where: {
                      movieId: movieId,
                      date: {
                        [Op.eq]: selectedDate,
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            nest: true,
          }
        );
      }

      const cinemaValid = cinemasHaveShows.filter(
        (cinema) => cinema.MovieHalls.length > 0
      );

      const filterCinema = cinemaValid.map((cinema) => ({
        value: cinema.id,
        label: cinema.name,
      }));

      let allShows = [];

      if (cinemaValid.length > 0) {
        if (cinema == null || cinema == "-1") {
          allShows = await showServices.getAllShowInCinema(
            movieId,
            selectedDate,
            cinemaValid
          );
        } else {
          const cinemaDoc = await db.Cinema.findOne({
            where: {
              id: cinema,
            },
            include: [
              {
                model: db.MovieHall,
              },
            ],
          });

          allShows = await showServices.getAllShowInCinema(
            movieId,
            selectedDate,
            [cinemaDoc]
          );
        }
      }

      return {
        statusCode: 0,
        message: "Lấy danh sách rạp phim thành công",
        data: filterCinema,
        cinemaValid,
        allShows: allShows,
      };
    } catch (error) {
      console.log("errorxxx", error.message);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi lấy danh sách rạp phim",
      };
    }
  }

  async getAllCinemaByCity(locationCode) {
    try {
      const cinemas = await db.Cinema.findAll({
        where: {
          location: {
            [Op.contains]: [locationCode],
          },
        },
        include: [
          {
            model: db.MovieHall,
            include: [{ model: db.RoomType }],
          },
        ],
      });

      return {
        statusCode: 0,
        message: "Lấy danh sách rạp phim thành công",
        data: cinemas,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi lấy danh sách rạp phim",
      };
    }
  }

  async getLimitCinema({ page, limit }) {
    try {
      const { count, rows: cinemaDoc } = await db.Cinema.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: [["createdAt", "ASC"]],
        include: {
          model: db.User,
        },
      });
      if (cinemaDoc) {
        return {
          statusCode: 0,
          message: "Lấy dữ liệu thành công",
          data: cinemaDoc,
          rows: count,
        };
      }
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getLimitCinema",
      };
    }
  }

  async searchCinema(city, district, name) {
    try {
      let cinemaDoc;
      console.log("city", city);
      if (district == null && city == null) {
        cinemaDoc = await db.Cinema.findAll({
          where: {
            [Op.or]: [
              {
                detailLocation: {
                  [Op.iLike]: `%${name}%`,
                },
              },
              {
                name: {
                  [Op.iLike]: `%${name}%`,
                },
              },
            ],
          },
          include: [
            {
              model: db.User,
            },
          ],
        });
      } else if (district == null) {
        cinemaDoc = await db.Cinema.findAll({
          where: {
            location: {
              [Op.contains]: [city],
            },
            [Op.or]: [
              {
                detailLocation: {
                  [Op.iLike]: `%${name}%`,
                },
              },
              {
                name: {
                  [Op.iLike]: `%${name}%`,
                },
              },
            ],
          },
          include: [
            {
              model: db.User,
            },
          ],
        });
      } else {
        cinemaDoc = await db.Cinema.findAll({
          where: {
            location: {
              [Op.contains]: [city],
            },
            [Op.or]: [
              {
                detailLocation: {
                  [Op.iLike]: `%${name}%`,
                },
              },
              {
                name: {
                  [Op.iLike]: `%${name}%`,
                },
              },
            ],
          },
          include: [
            {
              model: db.User,
            },
          ],
        });
      }

      if (cinemaDoc) {
        return {
          statusCode: 0,
          message: "Lấy dữ liệu thành công",
          data: cinemaDoc,
          // filterAfter,
        };
      }

      return {
        statusCode: 1,
        message: "Lấy dữ liệu thất bại",
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi searchCinema",
      };
    }
  }
}

export default new CinemaServices();
