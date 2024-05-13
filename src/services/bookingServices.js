import moment from "moment";
import db from "../app/models";
import {
  sendEmailAfterUpdateTicketStatus,
  sendTicketBooked,
} from "../middleWares/nodeMailer";
import discountServices from "./discountServices";
import notificationServices from "./notificationServices";
import seatStatusServices from "./seatStatusServices";
// eslint-disable-next-line no-undef
const { Op } = require("sequelize");

function getLastSixMonths() {
  let currentDate = new Date(); // Lấy thời điểm hiện tại
  let lastSixMonths = [];

  for (let i = 0; i < 6; i++) {
    let startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );

    let endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      0
    );
    const test = `${startOfMonth.toLocaleString("vi", {
      month: "long",
    })}/${startOfMonth.getFullYear("vi", { month: "year" })}`;

    lastSixMonths.push({
      start: startOfMonth,
      end: endOfMonth,
      monthLabel: test,
    });
  }

  return lastSixMonths;
}

async function sendEmailToUser(userId) {
  // send email after user booking successful
  const userData = await db.User.findOne({
    where: {
      id: userId,
    },
  });

  if (!userData) {
    return false;
  }

  const userTicketLink = `http://127.0.0.1:5173/user/${userId}/all-tickets`;

  sendTicketBooked(userData.email, userTicketLink, userData.fullName);

  return true;
}

// send email after update ticket status successful
async function sendEmailUpdateTicketStatus(bookingId) {
  try {
    const infoBooking = await db.Booking.findOne({
      where: {
        id: bookingId,
      },
      include: [
        {
          model: db.Show,
          include: [
            {
              model: db.MovieHall,
              include: [{ model: db.Cinema }, { model: db.RoomType }],
            },
            {
              model: db.Movie,
            },
          ],
        },
        {
          model: db.SeatStatus,
          include: [
            {
              model: db.Seat,
            },
          ],
        },
        {
          model: db.User,
        },
      ],
    });

    if (!infoBooking) {
      return false;
    }

    const seatsName = infoBooking.SeatStatuses.map((item) => {
      return item.Seat.name;
    }).join(", ");

    const userTicketLink = `http://127.0.0.1:5173/user/${infoBooking.User.id}/all-tickets`;

    sendEmailAfterUpdateTicketStatus(
      infoBooking.User.email,
      userTicketLink,
      infoBooking,
      seatsName
    );

    return true;
  } catch (error) {
    console.log("error", error);
  }
}

class BookingServices {
  async createBooking(
    userId,
    paymentMethod,
    seatIds,
    totalPrice,
    showId,
    isPaid,
    discount,
    status,
    sendEmail
  ) {
    try {
      let discountId = null;
      if (discount) {
        const isValidDiscount = await discountServices.checkValidDiscount(
          discount
        );

        if (isValidDiscount.isValid == false) {
          return {
            statusCode: 6,
            message: `Mã giảm giá không hợp lệ hoặc hết lượt sử dụng`,
          };
        }

        const decreaseDiscount =
          await discountServices.decreaseDiscountQuantity(discount);

        if (decreaseDiscount.statusCode !== 0) {
          return {
            statusCode: 7,
            message: `Có lỗi xảy ra trong khi sử dụng mã giảm giá`,
          };
        }

        discountId = decreaseDiscount.data.id;
      }

      for (let seatId of seatIds) {
        const checkSeatAvailable = await seatStatusServices.checkSeatStatus(
          seatId,
          showId
        );
        if (checkSeatAvailable.statusCode !== 0) {
          return {
            statusCode: 5,
            message: `Ghế mà bạn chọn đã được ai đó vừa mới đặt, vui lòng tải lại trang và chọn ghế khác.`,
            data: checkSeatAvailable,
          };
        }
      }

      const showDoc = await db.Show.findOne({
        where: {
          id: showId,
        },
      });

      await db.Movie.increment(
        { countBooked: 1 },
        { where: { id: showDoc.movieId } }
      );

      const bookingDoc = await db.Booking.create({
        userId: userId,
        showId: showId,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        isPaid: isPaid,
        discountId: discountId,
        status: status,
        date: new Date(),
      });

      if (!bookingDoc) {
        return {
          statusCode: 1,
          message: "Tạo booking thất bại",
        };
      }

      for (let seatId of seatIds) {
        const res = await seatStatusServices.createSeatStatus(
          seatId,
          showId,
          bookingDoc.id
        );
        if (res.statusCode != 0) {
          return res;
        }
      }

      // check is send email
      if (sendEmail) {
        const isSentMail = await sendEmailToUser(userId);

        if (!isSentMail) {
          return {
            statusCode: 0,
            message: "Gửi email đến người dùng thất bại",
            data: bookingDoc,
          };
        }
      }

      return {
        statusCode: 0,
        message: "Tạo booking thành công",
        data: bookingDoc,
      };
    } catch (error) {
      console.log(error.message);
      return {
        error: error.message,
        statusCode: 3,
        message: "Đã có lỗi xảy ra tại createBooking - BookingServices",
      };
    }
  }

  async getAllBookingsByUserId(userId) {
    try {
      const allBookings = await db.Booking.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: db.Show,
            include: [
              {
                model: db.MovieHall,
                include: [{ model: db.Cinema }, { model: db.RoomType }],
              },
              {
                model: db.Movie,
              },
            ],
          },
          {
            model: db.SeatStatus,
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
          { model: db.User, as: "Staff" },
        ],

        order: [["createdAt", "DESC"]],
      });

      if (!allBookings) {
        return {
          statusCode: 1,
          message: "Lỗi trong khi getAllBookingsByUserId",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy booking thành công",
        data: allBookings,
      };
    } catch (error) {
      console.log(error);
      return {
        error: error.message,
        statusCode: 4,
        message:
          "Đã có lỗi xảy ra tại getAllBookingsByUserId - BookingServices",
      };
    }
  }

  async deleteBooking(bookingId) {
    try {
      const infoBooking = await db.Booking.findOne({
        where: {
          id: bookingId,
        },
        include: [
          {
            model: db.Show,
            include: [
              {
                model: db.MovieHall,
                include: [{ model: db.Cinema }, { model: db.RoomType }],
              },
              {
                model: db.Movie,
              },
            ],
          },
          {
            model: db.SeatStatus,
            include: [
              {
                model: db.Seat,
              },
            ],
          },
        ],
      });

      if (!infoBooking) {
        return {
          statusCode: 1,
          message: "Không tìm thấy vé",
        };
      }

      await infoBooking.destroy();

      for (const seatStatus of infoBooking.SeatStatuses) {
        await seatStatusServices.deleteSeatStatus(seatStatus.id);
      }

      return {
        statusCode: 0,
        message: "Huỷ vé thành công",
        data: infoBooking,
      };
    } catch (error) {
      console.log(error);
      return {
        error: error.message,
        statusCode: 4,
        message: "Đã có lỗi xảy ra tại deleteBooking - BookingServices",
      };
    }
  }

  async updateBookingByStaff(bookingId, staffId, status) {
    try {
      const booking = await db.Booking.findByPk(bookingId);

      if (!booking) {
        return {
          statusCode: 1,
          message: "Không tìm thấy vé",
        };
      }

      if (booking.status == "Đã huỷ") {
        return {
          statusCode: 2,
          message: "Vé này đã bị huỷ trước đó, không thể cập nhật",
        };
      }

      // delete seat status and increase discount quantity
      if (status == "Đã huỷ") {
        const infoBooking = await db.Booking.findOne({
          where: {
            id: bookingId,
          },
          include: [
            {
              model: db.Show,
              include: [
                {
                  model: db.MovieHall,
                  include: [{ model: db.Cinema }, { model: db.RoomType }],
                },
                {
                  model: db.Movie,
                },
              ],
            },
            {
              model: db.SeatStatus,
              include: [
                {
                  model: db.Seat,
                },
              ],
            },
          ],
        });

        for (const seatStatus of infoBooking.SeatStatuses) {
          await seatStatusServices.deleteSeatStatus(seatStatus.id);
        }

        await db.Movie.decrement(
          { countBooked: 1 },
          { where: { id: infoBooking.Show.Movie.id } }
        );

        if (booking.discountId) {
          const increaseDiscount =
            await discountServices.increaseDiscountQuantity(booking.discountId);

          if (increaseDiscount.statusCode !== 0) {
            return {
              statusCode: 5,
              message: "có lỗi trong quá trình xử lý mã giảm giá",
            };
          }
        }
      }

      const bookingDoc = await db.Booking.findOne({
        where: {
          id: bookingId,
        },
        include: [
          {
            model: db.Show,
            include: [
              {
                model: db.MovieHall,
                include: [
                  {
                    model: db.Cinema,
                  },
                ],
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
      });

      if (status == "Đã thanh toán") {
        await booking.update({ staffId, status, isPaid: true });

        await notificationServices.createNotification({
          userId: bookingDoc.Show.MovieHall.Cinema.userId,
          title: `${bookingDoc.User.fullName} - Đặt vé thành công`,
          message: `Khách hàng ${bookingDoc.User.fullName} -  ${bookingDoc.User.phone} đã đặt vé phim ${bookingDoc.Show.Movie.title} thành công`,
          linkNotification: `/employee/manage-booking`,
          typeNotification: "default",
        });
      } else {
        if (staffId) {
          await booking.update({ staffId, status });

          const staffDoc = await db.User.findOne({
            where: {
              id: staffId,
            },
            include: [
              {
                model: db.Cinema,
              },
            ],
          });

          await notificationServices.createNotification({
            userId: bookingDoc.userId,
            title: `Đã nhận vé`,
            message: `Nhân viên ${staffDoc.fullName} -  ${staffDoc.Cinema.name} đã xác nhận rằng bạn đã nhận vé. Chúc bạn xem phim vui vẻ.`,
            linkNotification: `user/${bookingDoc.userId}/all-tickets`,
            typeNotification: "default",
          });
        } else {
          await booking.update({ staffId: null, status });
        }
      }

      const isSentEmail = await sendEmailUpdateTicketStatus(bookingId);

      if (!isSentEmail) {
        return {
          statusCode: 0,
          message: "Gửi email tới người dùng thất bại",
          data: booking,
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật thành công",
        data: booking,
      };
    } catch (error) {
      console.log(error);
      return {
        error: error.message,
        statusCode: 4,
        message: "Đã có lỗi xảy ra tại updateBookingByStaff - BookingServices",
      };
    }
  }

  async getBookingByStatus(status) {
    try {
      let allBookings;

      if (status === "Tất cả") {
        allBookings = await db.Booking.findAll({
          include: [
            {
              model: db.Show,
              include: [
                {
                  model: db.MovieHall,
                  include: [{ model: db.Cinema }, { model: db.RoomType }],
                },
                {
                  model: db.Movie,
                },
              ],
            },
            { model: db.User },
            { model: db.User, as: "Staff" }, //staff id
            {
              model: db.SeatStatus,
              include: [
                {
                  model: db.Seat,
                },
              ],
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      } else {
        allBookings = await db.Booking.findAll(
          {
            where: {
              status: status,
            },
            include: [
              {
                model: db.Show,
                include: [
                  {
                    model: db.MovieHall,
                    include: [{ model: db.Cinema }, { model: db.RoomType }],
                  },
                  {
                    model: db.Movie,
                  },
                ],
              },
              { model: db.User },
              { model: db.User, as: "Staff" },
              {
                model: db.SeatStatus,
                include: [
                  {
                    model: db.Seat,
                  },
                ],
              },
            ],
          },
          {
            order: [["createdAt", "ASC"]],
          }
        );
      }

      if (!allBookings) {
        return {
          statusCode: 1,
          message: "Lỗi trong khi getBookingByStatus",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy booking thành công",
        data: allBookings,
      };
    } catch (error) {
      console.log(error);
      return {
        error: error.message,
        statusCode: 4,
        message: "Đã có lỗi xảy ra tại getBookingByStatus - BookingServices",
      };
    }
  }

  async getBookingByStaff(staffId) {
    try {
      const cinemaDoc = await db.Cinema.findOne({
        where: {
          userId: staffId,
        },
      });

      if (!cinemaDoc) {
        return {
          statusCode: 1,
          message: "Khong tim thay du lieu",
        };
      }

      const allMovieHall = await db.MovieHall.findAll({
        where: {
          cinemaId: cinemaDoc.id,
        },
      });

      let bookingData = [];

      if (allMovieHall.length > 0) {
        const movieHallIds = allMovieHall.map((item) => item.id);

        const allShows = await db.Show.findAll({
          where: {
            movieHallId: {
              [Op.in]: movieHallIds,
            },
          },
        });

        if (allShows.length > 0) {
          const showIds = allShows.map((item) => item.id);
          console.log("showIds-------", showIds);
          const allBookings = await db.Booking.findAll({
            where: {
              showId: {
                [Op.in]: showIds,
              },
            },
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: db.Show,
                include: [
                  {
                    model: db.MovieHall,
                    include: [{ model: db.Cinema }, { model: db.RoomType }],
                  },
                  {
                    model: db.Movie,
                  },
                ],
              },
              { model: db.User },
              { model: db.User, as: "Staff" }, //staff id
              {
                model: db.SeatStatus,
                include: [
                  {
                    model: db.Seat,
                  },
                ],
              },
            ],
          });
          bookingData = allBookings;
        }
      }

      return {
        statusCode: 0,
        message: "Thanh cong",
        data: bookingData,
      };
    } catch (error) {
      return {
        error: error.message,
        statusCode: -1,
        message: "Đã có lỗi xảy ra tại getBookingByStaff",
      };
    }
  }

  async statisticBooking() {
    try {
      const data = [];
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(today);
        const weekEnd = new Date(today);
        weekStart.setDate(today.getDate() - 7 * (i + 1));
        weekEnd.setDate(today.getDate() - 7 * i);

        const bookingCount = await db.Booking.sum("totalPrice", {
          where: {
            createdAt: {
              [Op.between]: [weekStart, weekEnd],
            },
            isPaid: true,
          },
        });

        data.push({
          name: `Tuần ${5 - i}`,
          "Doanh thu": bookingCount ? bookingCount : 0,
        });
      }

      return {
        statusCode: 0,
        message: "Thành công",
        data: data.reverse(),
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại statisticBooking",
      };
    }
  }

  async statisticUserBooking(userId, date, timeType) {
    try {
      const currentDate = moment(date).toDate();

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
            userId: userId,
            isPaid: true,
            date: {
              [Op.between]: [dateFormatted, endDate],
            },
          },
        });

        const { count: countBookingSuccess } = await db.Booking.findAndCountAll(
          {
            where: {
              userId: userId,
              isPaid: true,
              date: {
                [Op.between]: [dateFormatted, endDate],
              },
            },
          }
        );

        const { count: countBookingFail } = await db.Booking.findAndCountAll({
          where: {
            userId: userId,
            isPaid: false,
            date: {
              [Op.between]: [dateFormatted, endDate],
            },
          },
        });

        bookingStatistic.push({
          date: moment(dateFormatted).format("DD/MM/YY"),
          // date: moment(dateFormatted).tz("Asia/Ho_Chi_Minh").format("DD/MM/YY"),
          "Tiền đã chi": bookingSum ? bookingSum : 0,
        });

        countBookingStatistic.push({
          date: moment(dateFormatted).format("DD/MM/YY"),
          "Vé thành công": countBookingSuccess,
          "Vé bị huỷ": countBookingFail,
        });
      }

      const { count: totalReview } = await db.Review.findAndCountAll({
        where: {
          userId: userId,
        },
      });

      const { count: totalBooking } = await db.Booking.findAndCountAll({
        where: {
          userId: userId,
          isPaid: true,
        },
      });

      const totalPrice = await db.Booking.sum("totalPrice", {
        where: {
          userId: userId,
          isPaid: true,
        },
      });

      return {
        statusCode: 0,
        message: "Thành công",
        // data: stats.reverse(),
        data: {
          bookingStatistic,
          countBookingStatistic,
          totalReview,
          totalPrice,
          totalBooking,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại statisticUserBooking",
      };
    }
  }

  async moneyStatisticUserBooking(userId) {
    try {
      let stats = [];

      const months = getLastSixMonths();

      for (const month of months) {
        const totalMoney = await db.Booking.sum("totalPrice", {
          where: {
            userId: userId,
            status: "Đã thanh toán",
            createdAt: {
              [Op.between]: [month.start, month.end],
            },
          },
        });

        stats.push({
          month: month.monthLabel,
          totalMoney: totalMoney ? totalMoney : 0,
        });
      }

      return {
        statusCode: 0,
        message: "Thành công",
        data: stats.reverse(),
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại statisticUserBooking",
      };
    }
  }

  async getBookingById(bookingId) {
    try {
      const bookingDoc = await db.Booking.findByPk(bookingId);

      if (!bookingDoc) {
        return {
          statusCode: 1,
          message: "Lấy dữ liệu của booking thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Thành công",
        data: bookingDoc,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại getBookingById",
        error: error.message,
      };
    }
  }
}

export default new BookingServices();
