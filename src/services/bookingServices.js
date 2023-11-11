import db from "../app/models";
import seatServices from "./seatServices";
import seatStatusServices from "./seatStatusServices";

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
            message: `Ghế ${checkSeatAvailable.data.Seat} mà bạn chọn đã được ai đó vừa mới đặt, vui lòng tải lại trang và chọn ghế khác.`,
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
              },
            ],
          },
        ],
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
}

export default new BookingServices();
