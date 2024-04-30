import { Op } from "sequelize";
import db from "../app/models";
import showServices from "./showServices";
import { S3Controller } from "../app/controllers";

async function checkValidNameCinema(name, location) {
  try {
    const cinemaDoc = await db.Cinema.findOne({
      where: {
        name: name,
        location: location,
      },
    });

    if (cinemaDoc) {
      return {
        statusCode: 1,
        message: `Tên rạp chiếu phim đã tồn tại ở địa điểm này`,
      };
    }

    return {
      statusCode: 0,
      message: `Hợp lệ`,
    };
  } catch (error) {
    console.log("error", error);
  }
}

class CinemaServices {
  async createCinema({
    name,
    location,
    detailLocation,
    userId,
    hotline,
    status,
    file,
  }) {
    try {
      const checkNameCinema = await checkValidNameCinema(name, location);

      if (checkNameCinema.statusCode != 0) {
        return {
          statusCode: 3,
          message: `${name} đã bị trùng tại địa điểm này, vui lòng chọn tên khác`,
        };
      }

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

      let imageLink;
      if (file.length > 0) {
        const imgUpload = await S3Controller.handleUploadImages(file);
        if (imgUpload.statusCode === 0) {
          imageLink = imgUpload.data;
        } else {
          return imgUpload;
        }
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

  async updateCinema({ data }, file) {
    try {
      const cinema = await db.Cinema.findByPk(data.id);

      if (!cinema) {
        return {
          statusCode: 1,
          message: "Rạp phim không tồn tại",
        };
      }

      if (data.userId != cinema.userId) {
        const checkUserValid = await db.Cinema.findOne({
          where: {
            userId: data.userId,
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
      }

      console.log("cinema.name", cinema.name);

      if (data.name !== cinema.name) {
        const checkCinemaName = await checkValidNameCinema(
          data.name,
          data.location
        );

        if (checkCinemaName.statusCode != 0) {
          return {
            statusCode: 3,
            message: `${data.name} đã bị trùng tại địa điểm này, vui lòng chọn tên khác`,
          };
        }
      }
      const imgOld = cinema.image;

      let imageLink;
      if (file.length > 0) {
        const imgUpload = await S3Controller.handleUploadImages(file);
        if (imgUpload.statusCode === 0) {
          imageLink = imgUpload.data;
        } else {
          return imgUpload;
        }
      }

      cinema.name = data.name;
      cinema.location = data.location;
      cinema.detailLocation = data.detailLocation;
      cinema.hotline = data.hotline;
      cinema.status = data.status;
      cinema.userId = data.userId;
      cinema.image = imageLink[0];

      await cinema.save();

      await S3Controller.handleDelteImagesFromLink(imgOld);

      return {
        statusCode: 0,
        message: "Cập nhật rạp phim thành công",
        data: cinema,
      };
    } catch (error) {
      console.log("error", error);
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
      }

      if (district == null) {
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
              [Op.contains]: [city, district],
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

  async getCinemaByStaff(staffId) {
    try {
      const cinemaDoc = await db.Cinema.findOne({
        where: {
          userId: staffId,
        },
      });

      if (cinemaDoc) {
        return {
          statusCode: 0,
          message: "Lấy dữ liệu thành công",
          data: cinemaDoc,
        };
      }

      return {
        statusCode: 1,
        message: "Không tìm thấy dữ liệu",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Đã có lỗi xảy ra khi getCinemaByStaff",
        error: error.message,
      };
    }
  }
}

export default new CinemaServices();
