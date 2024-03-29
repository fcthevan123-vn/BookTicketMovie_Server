import db from "../app/models";
import seatServices from "./seatServices";
import seatStatusServices from "./seatStatusServices";
// eslint-disable-next-line no-undef
const { Op } = require("sequelize");

class BookingServices {
  async createBooking(
    userId,
    paymentMethod,
    seatIds,
    totalPrice,
    showId,
    isPaid
  ) {
    try {
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

      const bookingDoc = await db.Booking.create({
        userId: userId,
        showId: showId,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        isPaid: isPaid,
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

      return {
        statusCode: 0,
        message: "Tạo booking thành công",
        data: bookingDoc,
      };
    } catch (error) {
      console.log(error);
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

      if (infoBooking.status == "Chờ xác nhận") {
        await infoBooking.destroy();

        for (const seatStatus of infoBooking.SeatStatuses) {
          await seatStatusServices.deleteSeatStatus(seatStatus.id);
        }
      } else {
        return {
          statusCode: 2,
          message:
            "Vé này đã được cập nhật bởi nhân viên, vui lòng tải lại trang và liên hệ với nhân viên để huỷ.",
        };
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
      }

      if (status == "Đã thanh toán") {
        await booking.update({ staffId, status, isPaid: true });
      } else {
        await booking.update({ staffId, status });
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

        // const userCount = await db.User.count({
        //   where: {
        //     createdAt: {
        //       [Op.between]: [weekStart, weekEnd],
        //     },
        //   },
        // });

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
}

export default new BookingServices();
