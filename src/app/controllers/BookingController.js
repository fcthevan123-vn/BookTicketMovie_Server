import { bookingServices } from "../../services";

class BookingController {
  async handleCreateBooking(req, res) {
    const {
      userId,
      paymentMethod,
      totalPrice,
      showId,
      isPaid,
      seatIds,
      discount,
      status,
    } = req.body;

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
        isPaid,
        discount,
        status
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

  async handleDeleteBooking(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await bookingServices.deleteBooking(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleDeleteBooking",
        err: error.message,
      });
    }
  }

  async handleUpdateBooking(req, res) {
    const { bookingId, staffId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await bookingServices.updateBookingByStaff(
        bookingId,
        staffId,
        status
      );
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleDeleteBooking",
        err: error.message,
      });
    }
  }

  async handleGetBookingByStatus(req, res) {
    const { status } = req.query;

    if (!status) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await bookingServices.getBookingByStatus(status);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetBookingByStatus",
        err: error.message,
      });
    }
  }

  async handleGetBookingByStaff(req, res) {
    const { staffId } = req.query;

    try {
      const response = await bookingServices.getBookingByStaff(staffId);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetBookingByStaff",
        err: error.message,
      });
    }
  }

  async handleGetStatistic(req, res) {
    try {
      const response = await bookingServices.statisticBooking();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetStatistic",
        err: error.message,
      });
    }
  }

  async handleGetUserStatistic(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(401).json({
          statusCode: 1,
          message: "Nhập thiếu thông tin",
        });
      }

      const response = await bookingServices.statisticUserBooking(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetUserStatistic",
        err: error.message,
      });
    }
  }

  async handleGetUserMoneyStatistic(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(401).json({
          statusCode: 1,
          message: "Nhập thiếu thông tin",
        });
      }

      const response = await bookingServices.moneyStatisticUserBooking(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetUserMoneyStatistic",
        err: error.message,
      });
    }
  }
}

export default new BookingController();
