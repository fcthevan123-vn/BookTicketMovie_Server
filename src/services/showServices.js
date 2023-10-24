import { Op } from "sequelize";
import db from "../app/models";
import cinemaServices from "./cinemaServices";

class ShowServices {
  // async getSeatStatusOfShowsByMovieId(movieId, roomTypeId, date, locationCode) {
  //   try {
  //     const cinemaByCity = await cinemaServices.getAllCinemaByCity(
  //       locationCode
  //     );

  //     let shows = [];

  //     if (cinemaByCity.statusCode !== 0) {
  //       return {
  //         statusCode: 0,
  //         message: "Có lỗi khi getAllCinemaByCity",
  //       };
  //     }

  //     for (const cinema of cinemaByCity.data) {
  //       const showsByCinema = await db.Show.findAll({
  //         where: {
  //           movieId: movieId,
  //           date: {
  //             [Op.eq]: date,
  //           },
  //         },
  //         include: [
  //           {
  //             model: db.MovieHall,
  //             where: {
  //               cinemaId: cinema.id,
  //               roomTypeId: roomTypeId,
  //             },
  //             include: [
  //               {
  //                 model: db.Layout,
  //               },
  //               {
  //                 model: db.RoomType,
  //               },
  //             ],
  //           },
  //         ],
  //       });

  //       const convertData = {
  //         cinema: cinema,
  //         allShows: showsByCinema,
  //       };

  //       shows.push(convertData);
  //     }

  //     // const shows = await db.Show.findAll({
  //     //   where: {
  //     //     movieId: movieId,
  //     //     date: {
  //     //       [Op.eq]: date,
  //     //     },
  //     //   },
  //     //   include: [
  //     //     {
  //     //       model: db.MovieHall,
  //     //       where: {
  //     //         roomTypeId: roomTypeId,
  //     //       },
  //     //       include: [
  //     //         {
  //     //           model: db.Layout,
  //     //         },
  //     //         {
  //     //           model: db.Cinema,
  //     //           where: {
  //     //             location: {
  //     //               [Op.contains]: [locationCode],
  //     //             },
  //     //           },
  //     //         },
  //     //       ],
  //     //     },
  //     //   ],
  //     // });

  //     for (const showPath of shows) {
  //       for (const show of showPath.allShows) {
  //         const totalSeats = await db.Seat.count({
  //           where: {
  //             layoutId: show.MovieHall.Layout.id,
  //           },
  //         });

  //         const bookedSeats = await db.SeatStatus.count({
  //           where: {
  //             showId: show.id,
  //             isBooked: true,
  //           },
  //         });

  //         const availableSeats = totalSeats - bookedSeats;

  //         show.dataValues.totalSeats = totalSeats;
  //         show.dataValues.bookedSeats = bookedSeats;
  //         show.dataValues.availableSeats = availableSeats;
  //       }
  //     }

  //     return {
  //       statusCode: 0,
  //       message: "Lấy show thành công",
  //       data: shows,
  //     };
  //   } catch (error) {
  //     console.error("Error while fetching shows:", error);
  //     return [];
  //   }
  // }

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

      // for (const cinema of cinemaByCity.data) {
      //   const showsByCinema = await db.Show.findAll({
      //     where: {
      //       movieId: movieId,
      //       date: date,
      //     },
      //     include: [
      //       {
      //         model: db.MovieHall,
      //         where: {
      //           cinemaId: cinema.id,
      //           roomTypeId: roomTypeId,
      //         },
      //         include: [
      //           {
      //             model: db.Layout,
      //           },
      //           {
      //             model: db.RoomType,
      //           },
      //         ],
      //       },
      //     ],
      //   });

      //   for (const show of showsByCinema) {
      //     const totalSeats = await db.Seat.count({
      //       where: {
      //         layoutId: show.MovieHall.Layout.id,
      //       },
      //     });

      //     const bookedSeats = await db.SeatStatus.count({
      //       where: {
      //         showId: show.id,
      //         isBooked: true,
      //       },
      //     });

      //     const availableSeats = totalSeats - bookedSeats;

      //     show.dataValues.totalSeats = totalSeats;
      //     show.dataValues.bookedSeats = bookedSeats;
      //     show.dataValues.availableSeats = availableSeats;
      //   }

      //   const convertData = {
      //     cinema: cinema,
      //     allShows: showsByCinema,
      //   };

      //   shows.push(convertData);
      // }

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
}

export default new ShowServices();
