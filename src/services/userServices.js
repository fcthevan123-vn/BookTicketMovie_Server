import moment from "moment";
import db, { Sequelize } from "../app/models";
import bcrypt from "bcrypt";
// eslint-disable-next-line no-undef
const { Op, where } = require("sequelize");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class UserServices {
  async createUser({
    fullName,
    email,
    phone,
    password,
    address,
    sex,
    age,
    type,
  }) {
    try {
      const emailExisted = await db.User.findOne({ where: { email } });
      if (emailExisted)
        return {
          statusCode: 2,
          message: "Email đã tồn tại",
        };

      const passwordHash = await bcrypt.hash(password, saltRounds);
      if (!passwordHash) {
        return {
          statusCode: 3,
          message: "Hash password failed.",
        };
      }

      let userDoc;

      if (type && type.length > 0) {
        userDoc = await db.User.create({
          fullName,
          email,
          password: passwordHash,
          phone,
          address,
          sex,
          age,
          type,
        });
      } else {
        userDoc = await db.User.create({
          fullName,
          email,
          password: passwordHash,
          phone,
          address,
          sex,
          age,
        });
      }

      if (userDoc) {
        return {
          statusCode: 0,
          message: "Đăng ký tài khoản thành công",
          user: userDoc,
        };
      } else {
        return {
          statusCode: 4,
          message: "Đăng ký tài khoản thất bại",
        };
      }
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 5,
        message: "Có lỗi xảy ra tại createUser",
      };
    }
  }

  async getUserById({ id }) {
    try {
      const userDoc = await db.User.findByPk(id, {
        raw: true,
        attributes: { exclude: ["password"] },
      });
      if (!userDoc) {
        return {
          statusCode: 1,
          message: "User does not exist",
        };
      }

      return {
        statusCode: 0,
        message: "Get user successfully",
        data: userDoc,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Something went wrong at getUserById",
      };
    }
  }

  async deleteUserById({ id }) {
    try {
      console.log("id-----------------", id);
      const checkIsEmployee = await db.Cinema.findOne({
        where: {
          userId: id,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });

      if (checkIsEmployee) {
        return {
          statusCode: 1,
          message: `${checkIsEmployee.User.fullName} đang làm nhân viên quản lý tại ${checkIsEmployee.name}. Vui lòng đổi nhân viên quản lý khác và thực hiện lại hành động`,
        };
      }

      const userExisted = await db.User.findOne({ where: { id } });
      if (!userExisted) {
        return {
          statusCode: 1,
          message: "Người dùng không tồn tại",
        };
      }

      await db.User.destroy({
        where: { id: id },
      });

      return {
        statusCode: 0,
        message: "Xoá tài khoản thành công",
        data: userExisted,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi deleteUserById",
      };
    }
  }

  async getAllUserByRule({ page, limit }) {
    try {
      const { count, rows: userDoc } = await db.User.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: [["createdAt", "ASC"]],
      });
      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Có lỗi xảy ra",
        };
      }

      return {
        statusCode: 0,
        message: "Get user thành công",
        data: userDoc,
        rows: count,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại getAllUserByRule",
      };
    }
  }

  async updateProfileUser({
    id,
    fullName,
    phone,
    address,
    sex,
    age,
    email,
    type,
  }) {
    try {
      let userDoc;
      if (email.length > 0) {
        userDoc = await db.User.update(
          {
            fullName,
            phone,
            address,
            sex,
            age,
            email,
            type,
          },
          {
            where: {
              id: id,
            },
          }
        );
      } else {
        userDoc = await db.User.update(
          {
            fullName,
            phone,
            address,
            sex,
            age,
          },
          {
            where: {
              id: id,
            },
          }
        );
      }

      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Người dùng không tồn tại",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật người dùng thành công",
        data: userDoc,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại updateProfileUser",
      };
    }
  }

  async changePassword({ id, oldPassword, newPassword }) {
    try {
      let userData = await db.User.findByPk(id, {
        raw: true,
      });

      const isComparePassword = await bcrypt.compareSync(
        oldPassword,
        userData.password
      );

      if (!isComparePassword) {
        return {
          statusCode: 1,
          message: `Mật khẩu không chính xác`,
        };
      }

      const hashPassword = bcrypt.hashSync(newPassword, salt);

      try {
        userData = await db.User.update(
          {
            password: hashPassword,
          },
          {
            where: {
              id: id,
            },
          }
        );

        if (userData) {
          return {
            statusCode: 0,
            message: "Đổi mật khẩu thành công",
            data: userData,
          };
        }
      } catch (error) {
        return {
          statusCode: 3,
          message: "Something went wrong at updateProfileUser - step2",
        };
      }
    } catch (error) {
      return {
        statusCode: 2,
        message: "Something went wrong at changePassword",
      };
    }
  }

  async searchUser({ name, page, limit }) {
    try {
      const { count, rows: userDoc } = await db.User.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        order: [["createdAt", "ASC"]],
        where: {
          [Op.or]: [
            {
              fullName: {
                [Op.iLike]: `%${name}%`,
              },
            },
            {
              email: {
                [Op.iLike]: `%${name}%`,
              },
            },
            {
              address: {
                [Op.iLike]: `%${name}%`,
              },
            },
          ],
        },
      });

      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy người dùng phù hợp",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy người dùng phù hợp",
        data: userDoc,
        rows: count,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm kiếm người dùng",
      };
    }
  }

  async statisticUser() {
    try {
      const { rows: userMaleDoc } = await db.User.findAndCountAll({
        // order: [["createdAt", "ASC"]],
        where: {
          sex: 0,
        },
      });

      const { rows: userFemaleDoc } = await db.User.findAndCountAll({
        // order: [["createdAt", "ASC"]],
        where: {
          sex: 1,
        },
      });

      if (!userMaleDoc || !userFemaleDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy người dùng phù hợp",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy người dùng phù hợp",
        data: {
          countMale: userMaleDoc.length,
          countFemale: userFemaleDoc.length,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm kiếm người dùng",
      };
    }
  }
  async statisticUserRegister() {
    try {
      const data = [];
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(today);
        const weekEnd = new Date(today);
        weekStart.setDate(today.getDate() - 7 * (i + 1));
        weekEnd.setDate(today.getDate() - 7 * i);

        const userCount = await db.User.count({
          where: {
            createdAt: {
              [Op.between]: [weekStart, weekEnd],
            },
          },
        });

        data.push({
          name: `Tuần ${5 - i}`,
          "Người dùng": userCount,
        });
      }

      return {
        statusCode: 0,
        message: "Tìm thấy người dùng phù hợp",
        data: data.reverse(),
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm kiếm người dùng",
      };
    }
  }

  async searchUserByType(type) {
    try {
      const userDoc = await db.User.findAll({
        where: {
          type: type,
        },
      });

      if (!userDoc) {
        return {
          statusCode: 1,
          message: "Có lỗi xảy ra",
        };
      }

      const convertData = userDoc.map((user) => {
        return {
          value: user.id,
          label: `${user.fullName} - ${user.email}`,
        };
      });

      return {
        statusCode: 0,
        message: "Get user thành công",
        data: userDoc,
        convertData: convertData,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại getAllUserByRule",
      };
    }
  }

  async adminGetQuantity() {
    try {
      const { count: countUser } = await db.User.findAndCountAll();
      const { count: countCinema, rows: cinemaDoc } =
        await db.Cinema.findAndCountAll();
      const { count: countMovieHall, rows: movieHallDoc } =
        await db.MovieHall.findAndCountAll();
      const { count: countMovie, rows: movieDoc } =
        await db.Movie.findAndCountAll();
      const { count: countReview } = await db.Review.findAndCountAll();

      const dataTotal = {
        countUser,
        countCinema,
        countMovieHall,
        countMovie,
        countReview,
      };

      const cinemaConvert = cinemaDoc.map((cinema) => {
        return {
          value: cinema.id,
          label: cinema.name,
        };
      });

      const movieHallConvert = movieHallDoc.map((movieHall) => {
        return {
          value: movieHall.id,
          label: movieHall.name,
          cinemaId: movieHall.cinemaId,
        };
      });

      const movieConvert = movieDoc.map((movie) => {
        return {
          value: movie.id,
          label: movie.title,
        };
      });

      const dataSelect = {
        cinema: cinemaConvert,
        movieHall: movieHallConvert,
        movie: movieConvert,
      };

      return {
        statusCode: 0,
        message: "Get user thành công",
        data: dataTotal,
        dataSelect,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại getAllUserByRule",
      };
    }
  }

  async statisticBookingAndCount({ cinemaId, movieHallId, movieId, timeType }) {
    try {
      let queryCinema = {};

      if (cinemaId != "null" && cinemaId != "-1") {
        queryCinema = {
          where: {
            id: cinemaId,
          },
        };
      }

      const cinemaDoc = await db.Cinema.findAll(queryCinema);

      const cinemaIds = cinemaDoc.map((cinema) => cinema.id);

      let queryMovieHall = {
        where: {
          cinemaId: cinemaIds,
        },
      };

      if (movieHallId != "null" && movieHallId != "-1") {
        queryMovieHall = {
          where: {
            id: movieHallId,
          },
        };
      }

      const movieHallDoc = await db.MovieHall.findAll(queryMovieHall);

      const movieHallIds = movieHallDoc.map((cinema) => cinema.id);

      let queryMovie = {};

      if (movieId != "null" && movieId != "-1") {
        console.log("movieId", movieId);
        queryMovie = {
          where: {
            id: movieId,
          },
        };
      }

      const movieDoc = await db.Movie.findAll(queryMovie);

      const movieIds = movieDoc.map((item) => item.id);

      const showDoc = await db.Show.findAll({
        where: {
          movieHallId: {
            [Op.in]: movieHallIds,
          },
          movieId: {
            [Op.in]: movieIds,
          },
        },
      });

      const showIds = showDoc.map((item) => item.id);

      const currentDate = moment().toDate();

      const listDays = [currentDate];

      for (let i = 1; i <= 4; i++) {
        const dateFormat = moment(currentDate).subtract(i, timeType).toDate();

        listDays.unshift(dateFormat);
      }

      const bookingStatistic = [];
      const countBookingStatistic = [];

      for (const dateFormatted of listDays) {
        const endDate = moment(dateFormatted)
          .add(1, timeType)
          .subtract(1, "days")
          .toDate();

        const bookingSum = await db.Booking.sum("totalPrice", {
          where: {
            showId: {
              [Op.in]: showIds,
            },
            isPaid: true,
            date: {
              [Op.between]: [dateFormatted, endDate],
            },
          },
        });

        const { count: countBookingSuccess } = await db.Booking.findAndCountAll(
          {
            where: {
              showId: {
                [Op.in]: showIds,
              },
              isPaid: true,
              date: {
                [Op.between]: [dateFormatted, endDate],
              },
            },
          }
        );

        const { count: countBookingFail } = await db.Booking.findAndCountAll({
          where: {
            showId: {
              [Op.in]: showIds,
            },
            isPaid: false,
            date: {
              [Op.between]: [dateFormatted, endDate],
            },
          },
        });

        bookingStatistic.push({
          date: moment(dateFormatted).format("DD/MM/YY"),
          "Doanh thu": bookingSum ? bookingSum : 0,
        });

        countBookingStatistic.push({
          date: moment(dateFormatted).format("DD/MM/YY"),
          "Vé thành công": countBookingSuccess,
          "Vé bị huỷ": countBookingFail,
        });
      }

      // const endDate =

      const { count: totalBooking } = await db.Booking.findAndCountAll();

      const totalSum = await db.Booking.sum("totalPrice", {
        where: {
          showId: {
            [Op.in]: showIds,
          },
          isPaid: true,
        },
      });

      // Trending movie
      let movieTrendingData = null;

      const movieTrending = await db.Movie.findAll({
        order: [["countBooked", "DESC"]],
      });

      if (movieTrending.length > 0) {
        const allShows = await db.Show.findAll({
          where: {
            movieId: movieTrending[0].id,
          },
        });

        const showIds = allShows.map((item) => item.id);

        const bookingSum = await db.Booking.sum("totalPrice", {
          where: {
            isPaid: true,
            showId: {
              [Op.in]: showIds,
            },
          },
        });

        const { count: bookingCount } = await db.Booking.findAndCountAll({
          where: {
            showId: {
              [Op.in]: showIds,
            },
          },
        });

        movieTrendingData = {
          movie: movieTrending[0],
          bookingSum,
          bookingCount,
        };
      }

      // trending cinema
      let max = 0;
      let cinemaTrending;
      let cinemaCount;

      const allCinema = await db.Cinema.findAll();

      const allCinemaIds = allCinema.map((item) => item.id);

      for (const cinemaId of allCinemaIds) {
        const allMovieHalls = await db.MovieHall.findAll({
          where: {
            cinemaId: cinemaId,
          },
        });

        if (allMovieHalls.length > 0) {
          const allMovieHallIds = allMovieHalls.map((item) => item.id);

          const allShows = await db.Show.findAll({
            where: {
              movieHallId: {
                [Op.in]: allMovieHallIds,
              },
            },
          });

          if (allShows.length > 0) {
            const allShowIds = allShows.map((item) => item.id);

            const bookingSum = await db.Booking.sum("totalPrice", {
              where: {
                showId: {
                  [Op.in]: allShowIds,
                },
                isPaid: true,
              },
            });

            const { count: bookingCount } = await db.Booking.findAndCountAll({
              where: {
                showId: {
                  [Op.in]: allShowIds,
                },
              },
            });

            if (bookingSum >= max) {
              max = bookingSum;
              const cinemaDoc = await db.Cinema.findByPk(cinemaId);
              cinemaTrending = cinemaDoc;
              cinemaCount = bookingCount;
            }
          }
        }
      }

      return {
        statusCode: 0,
        message: "Get user thành công",
        bookingStatistic,
        countBookingStatistic,
        totalBooking,
        totalSum,
        movieTrendingData,
        cinemaTrending: {
          cinemaTrending,
          max,
          cinemaCount,
        },
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại statisticBookingAndCount",
        error: error.message,
      };
    }
  }

  async staticByday({ date }) {
    try {
      const startOfTime = moment(date).startOf("day").toDate();
      const endOfTime = moment(date).endOf("day").toDate();
      // const userReg = await db.User.findAll({
      //   crea
      // })

      const { count: countReview } = await db.Review.findAndCountAll({
        where: {
          date: {
            [Op.eq]: date,
          },
        },
      });

      const { count: countShow } = await db.Show.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [startOfTime, endOfTime],
          },
        },
      });

      const { count: countBooking } = await db.Booking.findAndCountAll({
        where: {
          date: {
            [Op.eq]: date,
          },
        },
      });

      const { count: countUser } = await db.User.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [startOfTime, endOfTime],
          },
        },
      });

      let statisticUser = [];

      const intinialData = [
        {
          min: 0,
          max: 17,
          label: "Dưới 18 tuổi",
        },
        {
          min: 18,
          max: 25,
          label: "18 - 25 tuổi",
        },
        {
          min: 26,
          max: 35,
          label: "26 - 35 tuổi",
        },
        {
          min: 36,
          max: 18052002,
          label: "Trên 36 tuổi",
        },
      ];

      for (const data of intinialData) {
        const { count: userCountMale } = await db.User.findAndCountAll({
          where: {
            sex: "0",
            age: {
              [Op.between]: [data.min, data.max],
            },
          },
        });

        const { count: userCountFemale } = await db.User.findAndCountAll({
          where: {
            sex: "1",
            age: {
              [Op.between]: [data.min, data.max],
            },
          },
        });

        const dataFormat = {
          ageRange: data.label,
          Nam: userCountMale,
          Nữ: userCountFemale,
        };

        statisticUser.push(dataFormat);
      }

      return {
        statusCode: 0,
        message: "Thanh cong",
        countReview,
        countShow,
        countUser,
        countBooking,
        statisticUser,
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Có lỗi xảy ra tại staticByday",
        error: error.message,
      };
    }
  }

  async statisticEmployee(cinemaId) {
    try {
      const movieHallDocs = await db.MovieHall.findAll({
        where: { cinemaId: cinemaId },
      });

      const movieHallIds = movieHallDocs.map((movieHall) => movieHall.id);

      const showDoc = await db.Show.findAll({
        where: {
          movieHallId: {
            [Op.in]: movieHallIds,
          },
        },
        include: [
          {
            model: db.Movie,
          },
          {
            model: db.MovieHall,
          },
        ],
        order: [["startTime", "DESC"]],
      });

      const allShowDoc = await db.Show.findAll({
        where: {
          movieHallId: {
            [Op.in]: movieHallIds,
          },
        },
      });

      const showIds = allShowDoc.map((show) => show.id);

      const bookingDoc = await db.Booking.findAll({
        where: {
          showId: {
            [Op.in]: showIds,
          },
        },
        include: [
          {
            model: db.SeatStatus,
            include: [
              {
                model: db.Seat,
              },
            ],
          },
          {
            model: db.Show,
            include: [
              {
                model: db.MovieHall,
              },
              {
                model: db.Movie,
              },
            ],
          },
          {
            model: db.User,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return {
        statusCode: 0,
        message: "Thanh cong",
        recentShow: showDoc.slice(0, 5),
        recentBooking: bookingDoc.slice(0, 5),
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Có lỗi xảy ra tại statisticEmployee",
        error: error.message,
      };
    }
  }
}
export default new UserServices();
