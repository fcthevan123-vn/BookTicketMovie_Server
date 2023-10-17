import db from "../app/models";

class MovieHallServices {
  // async getAllMovieHall() {
  //   try {
  //     const movieHall = await db.MovieHall.findAll({
  //       include: [
  //         {
  //           model: db.Layout,
  //           include: [
  //             {
  //               model: db.Seat,
  //               include: [
  //                 {
  //                   model: db.SeatType,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //       nest: true,
  //     });

  //     return {
  //       statusCode: 0,
  //       message: "Thành công",
  //       data: movieHall,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       statusCode: 0,
  //       message: "Có lỗi xảy ra khi lấy dữ liệu",
  //     };
  //   }
  // }

  async createMovieHall({ number, name, roomTypeId, cinemaId, layoutId }) {
    try {
      const movieHall = await db.MovieHall.create({
        number,
        name,
        roomTypeId,
        cinemaId,
        layoutId,
      });

      return {
        statusCode: 0,
        message: "Tạo phòng chiếu phim thành công",
        data: movieHall,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tạo phòng chiếu phim",
      };
    }
  }

  async readMovieHall(id) {
    try {
      const movieHall = await db.MovieHall.findByPk(id);
      if (!movieHall) {
        return {
          statusCode: 1,
          message: "Phòng chiếu phim không tồn tại",
        };
      }

      return {
        statusCode: 0,
        message: "Truy vấn phòng chiếu phim thành công",
        data: movieHall,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi truy vấn phòng chiếu phim",
      };
    }
  }

  async updateMovieHall(id, { number, name, roomTypeId, cinemaId, layoutId }) {
    try {
      const movieHall = await db.MovieHall.findByPk(id);
      if (!movieHall) {
        return {
          statusCode: 1,
          message: "Phòng chiếu phim không tồn tại",
        };
      }

      await movieHall.update({ number, name, roomTypeId, cinemaId, layoutId });

      return {
        statusCode: 0,
        message: "Cập nhật phòng chiếu phim thành công",
        data: movieHall,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi cập nhật phòng chiếu phim",
      };
    }
  }

  async deleteMovieHall(id) {
    try {
      const movieHall = await db.MovieHall.findByPk(id);
      if (!movieHall) {
        return {
          statusCode: 1,
          message: "Phòng chiếu phim không tồn tại",
        };
      }

      await movieHall.destroy();

      return {
        statusCode: 0,
        message: "Xóa phòng chiếu phim thành công",
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi xóa phòng chiếu phim",
      };
    }
  }
}

export default new MovieHallServices();
