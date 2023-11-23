import { Op } from "sequelize";
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
      return {
        statusCode: 1,
        message: "Đã có lỗi xảy ra khi getLimitCinema",
      };
    }
  }
}

export default new CinemaServices();
