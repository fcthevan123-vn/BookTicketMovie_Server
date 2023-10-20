import db from "../app/models";

class ShowServices {
  async getSeatStatusOfShowsByMovieId(movieId) {
    try {
      const shows = await db.Show.findAll({
        where: {
          movieId: movieId,
        },
        include: [
          {
            model: db.MovieHall,

            include: [
              {
                model: db.Layout,
              },
            ],
          },
        ],
      });
      for (const show of shows) {
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

        // Thêm thông tin về số lượng ghế vào đối tượng show
        show.dataValues.totalSeats = totalSeats;
        show.dataValues.bookedSeats = bookedSeats;
        show.dataValues.availableSeats = availableSeats;
      }

      return {
        statusCode: 0,
        message: "Lấy show thành công",
        data: shows,
      };
    } catch (error) {
      console.error("Error while fetching shows:", error);
      return [];
    }
  }
}

export default new ShowServices();
