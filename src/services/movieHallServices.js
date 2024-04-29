import db from "../app/models";

async function checkVadidName(name, cinemaId) {
  try {
    const response = await db.MovieHall.findOne({
      where: {
        name: name,
        cinemaId: cinemaId,
      },
    });

    console.log("response", response);

    if (response) {
      return {
        statusCode: 1,
        message: "Đã tồn tại tên",
      };
    }

    return {
      statusCode: 0,
      message: "Tên hợp lệ",
    };
  } catch (error) {
    return {
      statusCode: -1,
      message: "Có lỗi xảy ra khi lấy dữ liệu",
    };
  }
}

class MovieHallServices {
  async getAllMovieHall() {
    try {
      const movieHall = await db.MovieHall.findAll({
        include: [
          {
            model: db.Layout,
          },
          {
            model: db.RoomType,
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

  async createMovieHall({ number, name, roomTypeId, cinemaId, layoutId }) {
    try {
      const checkName = await checkVadidName(name, cinemaId);

      if (checkName.statusCode !== 0) {
        return {
          statusCode: 1,
          message: "Tên phòng chiếu đã tồn tại, vui lòng chọn tên khác",
        };
      }

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

  async updateMovieHall({
    id,
    number,
    name,
    roomTypeId,
    cinemaId,
    layoutId,
    status,
  }) {
    try {
      const movieHall = await db.MovieHall.findByPk(id);
      if (!movieHall) {
        return {
          statusCode: 1,
          message: "Phòng chiếu phim không tồn tại",
        };
      }

      if (name != movieHall.name) {
        const checkName = await checkVadidName(name, cinemaId);

        if (checkName.statusCode !== 0) {
          return {
            statusCode: 1,
            message: "Tên phòng chiếu đã tồn tại, vui lòng chọn tên khác",
          };
        }
      }

      await movieHall.update({
        number,
        name,
        roomTypeId,
        cinemaId,
        layoutId,
        status,
      });

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

  async getAllMovieHallByStaff(staffId) {
    try {
      const movieHallByStaff = await db.User.findOne({
        where: {
          id: staffId,
        },
        include: [
          {
            model: db.Cinema,
            include: [
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
              {
                model: db.RoomType,
              },
              {
                model: db.Layout,
              },
            ],
          },
        ],
        nest: true,
      });

      return {
        statusCode: 0,
        message: "Thành công",
        data: movieHallByStaff,
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
