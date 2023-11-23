import db from "../app/models";
import cinemaServices from "./cinemaServices";
import moment from "moment";
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

  async createShow({ movieId, date, movieHallId, startTime, endTime }) {
    try {
      const showDoc = db.Show.create({
        movieId: movieId,
        date: date,
        movieHallId: movieHallId,
        startTime: startTime,
        endTime: endTime,
      });

      if (!showDoc) {
        return {
          statusCode: 1,
          message: "Tạo suất chiếu thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo suất chiếu thành công",
      };
    } catch (error) {
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
}

export default new ShowServices();
