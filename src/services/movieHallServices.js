import db from "../app/models";

class MovieHallServices {
  async getAllMovieHall() {
    try {
      const movieHall = await db.MovieHall.findAll({
        include: [
          {
            model: db.Layout,
            include: [
              {
                model: db.Seat,
                include: [
                  {
                    model: db.SeatType,
                  },
                ],
              },
            ],
          },
        ],
        nest: true,
      });

      return {
        statusCode: 0,
        message: "Thành công",
        data: movieHall,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 0,
        message: "Có lỗi xảy ra khi lấy dữ liệu",
      };
    }
  }
}

export default new MovieHallServices();
