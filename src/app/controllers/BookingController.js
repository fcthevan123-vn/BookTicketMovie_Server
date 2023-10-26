import { bookingServices } from "../../services";

class BookingController {
  async handleCreateBooking(req, res) {
    const { userId, paymentMethod, totalPrice, showId, isPaid, seatIds } =
      req.body;

    if (!userId || !paymentMethod || !totalPrice || !showId || !seatIds) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await bookingServices.createBooking(
        userId,
        paymentMethod,
        seatIds,
        totalPrice,
        showId,
        isPaid
      );
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleCreateBooking",
        err: error.message,
      });
    }
  }

  async handleGetBookingsByUserId(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await bookingServices.getAllBookingsByUserId(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetBookingsByUserId",
        err: error.message,
      });
    }
  }
}

export default new BookingController();
