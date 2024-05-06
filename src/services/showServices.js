import db from "../app/models";
import cinemaServices from "./cinemaServices";
import moment from "moment";
import "moment/locale/vi";
import { Op, where } from "sequelize";
moment.locale("vi");
class ShowServices {
  async getSeatStatusOfShowsByMovieId(movieId, roomTypeId, date, locationCode) {
    try {
      const cinemaByCity = await cinemaServices.getAllCinemaByCity(
        locationCode
      );

      if (cinemaByCity.statusCode !== 0) {
        return {
          statusCode: 0,
          message: "Có lỗi khi getAllCinemaByCity",
        };
      }

      const shows = [];

      for (const cinema of cinemaByCity.data) {
        const cinemaShows = [];

        for (const movieHall of cinema.MovieHalls) {
          const showsByCinema = await db.Show.findAll({
            where: {
              movieId: movieId,
              date: date,
            },
            include: [
              {
                model: db.MovieHall,
                where: {
                  roomTypeId: roomTypeId,
                  id: movieHall.id,
                  cinemaId: cinema.id,
                },
                include: [
                  {
                    model: db.Layout,
                  },
                ],
              },
            ],
          });

          for (const show of showsByCinema) {
            const totalSeats = await db.Seat.count({
              where: {
                layoutId: show.MovieHall.Layout.id,
              },
            });

            const bookedSeats = await db.SeatStatus.count({
              where: {
                showId: show.id,
                isBooked: true,
              },
            });

            const availableSeats = totalSeats - bookedSeats;

            show.dataValues.totalSeats = totalSeats;
            show.dataValues.bookedSeats = bookedSeats;
            show.dataValues.availableSeats = availableSeats;
          }

          cinemaShows.push({
            movieHall: movieHall,
            allShows: showsByCinema,
          });
        }

        shows.push({
          cinema: cinema,
          allShowsMovieHall: cinemaShows,
        });
      }

      return {
        statusCode: 0,
        message: "Lấy show thành công",
        data: shows,
      };
    } catch (error) {
      console.error("Error while fetching shows:", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình lấy dữ liệu show",
      };
    }
  }

  async getSeatStatusOfShowsByMovieIdAndAllRoomType(
    movieId,
    date,
    locationCode
  ) {
    try {
      const cinemaByCity = await cinemaServices.getAllCinemaByCity(
        locationCode
      );

      if (cinemaByCity.statusCode !== 0) {
        return {
          statusCode: 0,
          message: "Có lỗi khi getAllCinemaByCity",
        };
      }

      const shows = [];

      for (const cinema of cinemaByCity.data) {
        const cinemaShows = [];

        for (const movieHall of cinema.MovieHalls) {
          const showsByCinema = await db.Show.findAll({
            where: {
              movieId: movieId,
              date: date,
            },
            include: [
              {
                model: db.MovieHall,
                where: {
                  id: movieHall.id,
                  cinemaId: cinema.id,
                },
                include: [
                  {
                    model: db.Layout,
                  },
                ],
              },
            ],
          });

          for (const show of showsByCinema) {
            const totalSeats = await db.Seat.count({
              where: {
                layoutId: show.MovieHall.Layout.id,
              },
            });

            const bookedSeats = await db.SeatStatus.count({
              where: {
                showId: show.id,
                isBooked: true,
              },
            });

            const availableSeats = totalSeats - bookedSeats;

            show.dataValues.totalSeats = totalSeats;
            show.dataValues.bookedSeats = bookedSeats;
            show.dataValues.availableSeats = availableSeats;
          }

          cinemaShows.push({
            movieHall: movieHall,
            allShows: showsByCinema,
          });
        }

        shows.push({
          cinema: cinema,
          allShowsMovieHall: cinemaShows,
        });
      }

      return {
        statusCode: 0,
        message: "Lấy show thành công",
        data: shows,
      };
    } catch (error) {
      console.error("Error while fetching shows:", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình lấy dữ liệu show",
      };
    }
  }

  async getAllShowInCinema(movieId, date, cinemas, isArrange) {
    try {
      const shows = [];

      console.log("new Date", moment(new Date()).toDate());

      for (const cinema of cinemas) {
        const cinemaShows = [];

        for (const movieHall of cinema.MovieHalls) {
          const showsByCinema = await db.Show.findAll({
            where: {
              movieId: movieId,
              date: date,
              startTime: {
                [Op.gte]: new Date(),
              },
            },
            order: [["startTime", "ASC"]],
            include: [
              {
                model: db.MovieHall,
                where: {
                  id: movieHall.id,
                  cinemaId: cinema.id,
                },
                include: [
                  {
                    model: db.Layout,
                  },
                ],
              },
            ],
          });

          for (const show of showsByCinema) {
            const totalSeats = await db.Seat.count({
              where: {
                layoutId: show.MovieHall.Layout.id,
              },
            });

            const bookedSeats = await db.SeatStatus.count({
              where: {
                showId: show.id,
                isBooked: true,
              },
            });

            const availableSeats = totalSeats - bookedSeats;

            show.dataValues.totalSeats = totalSeats;
            show.dataValues.bookedSeats = bookedSeats;
            show.dataValues.availableSeats = availableSeats;
          }

          cinemaShows.push({
            movieHall: movieHall,
            allShows: showsByCinema,
          });
        }

        shows.push({
          cinema: cinema,
          allShowsMovieHall: cinemaShows,
        });
      }

      return {
        statusCode: 0,
        message: "Lấy show thành công",
        data: shows,
      };
    } catch (error) {
      console.error("Error while fetching shows:", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình lấy dữ liệu show",
        error: error.message,
      };
    }
  }

  async createShow({
    movieId,
    date,
    movieHallId,
    startTime,
    endTime,
    timeCheckStart,
    timeCheckEnd,
  }) {
    try {
      const validateStartTime = await db.Show.findAll({
        where: {
          movieHallId: movieHallId,
          date: date,
          movieId: movieId,
          startTime: {
            [Op.between]: [timeCheckStart, timeCheckEnd],
          },
        },
      });

      const validateEndTime = await db.Show.findAll({
        where: {
          movieHallId: movieHallId,
          date: date,
          movieId: movieId,
          endTime: {
            [Op.between]: [timeCheckStart, timeCheckEnd],
          },
        },
      });

      if (validateStartTime.length > 0 || validateEndTime.length > 0) {
        return {
          statusCode: 1,
          message:
            "Thời gian bạn chọn đã bị trùng, vui lòng kiểm tra và chọn lại. Lưu ý mỗi suất chiếu trong 1 phòng phải cách nhau 15 phút.",
          validateStartTime,
          validateEndTime,
        };
      }

      const showDoc = db.Show.create({
        movieId: movieId,
        date: date,
        movieHallId: movieHallId,
        startTime: startTime,
        endTime: endTime,
      });

      if (!showDoc) {
        return {
          statusCode: 2,
          message: "Đã có lỗi trong quá trình thêm suất chiếu",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo suất chiếu thành công",
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình createShow",
      };
    }
  }

  async deleteShow(showId) {
    try {
      const show = await db.Show.findOne({ where: { id: showId } });
      if (!show) {
        return {
          statusCode: 1,
          message: "Suất chiếu không tồn tại",
        };
      }

      await db.Show.destroy({
        where: { id: showId },
      });

      return {
        statusCode: 0,
        message: "Xoá suất chiếu thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình deleteShow",
      };
    }
  }

  async getShowByCinema(staffId) {
    try {
      const cinemaDoc = await db.Cinema.findOne({
        where: {
          userId: staffId,
        },
        include: [
          {
            model: db.MovieHall,
          },
        ],
      });

      const filterMovieHall = cinemaDoc.MovieHalls.map((item) => item.id);

      const filterMovieHallName = cinemaDoc.MovieHalls.map((item) => item.name);

      const allShows = await db.Show.findAll({
        where: {
          movieHallId: {
            [Op.in]: filterMovieHall,
          },
        },
        order: [["startTime", "ASC"]],
        include: [
          {
            model: db.Movie,
          },
          {
            model: db.MovieHall,
            include: [
              {
                model: db.Layout,
              },
              {
                model: db.RoomType,
              },
            ],
          },
        ],
      });

      return {
        statusCode: 0,
        message: "Lấy dữ liệu thành công",
        data: cinemaDoc,
        allShows,
        filterMovieHallName,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình getShowByCinema",
      };
    }
  }

  // async getShowByQuery(date, province, district) {}
}

export default new ShowServices();
