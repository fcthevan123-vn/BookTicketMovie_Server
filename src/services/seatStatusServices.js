import db from "../app/models";

class SeatStatusServices {
  async createSeatStatus(seatId, showId, bookingId) {
    try {
      const seatStatusDoc = await db.SeatStatus.create({
        seatId: seatId,
        isBooked: true,
        showId: showId,
        bookingId: bookingId,
      });

      if (!seatStatusDoc) {
        return {
          statusCode: 1,
          message: "Tạo SeatStatus thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo SeatStatus thành công",
        data: seatStatusDoc,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra tại createSeatStatus - SeatStatusServices",
      };
    }
  }
  async checkSeatStatus(seatId, showId) {
    try {
      const seatStatusDoc = await db.SeatStatus.findAll({
        where: {
          seatId: seatId,
          showId: showId,
        },
        include: [
          {
            model: db.Seat,
          },
        ],
      });

      if (seatStatusDoc.length > 0) {
        return {
          statusCode: 1,
          message: "Ghế đã được đặt",
          data: seatStatusDoc,
        };
      }

      return {
        statusCode: 0,
        message: "Ghế còn trống",
        data: seatStatusDoc,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra tại checkSeatStatus - SeatStatusServices",
      };
    }
  }
}

export default new SeatStatusServices();
