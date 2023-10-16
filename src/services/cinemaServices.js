import db from "../app/models";

class CinemaServices {
  async createCinema({ name, location, detailLocation }) {
    try {
      const cinema = await db.Cinema.create({
        name,
        location,
        detailLocation,
      });

      return {
        statusCode: 0,
        message: "Tạo rạp phim thành công",
        data: cinema,
      };
    } catch (error) {
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
      const cinemas = await db.Cinema.findAll();

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
}

export default new CinemaServices();
