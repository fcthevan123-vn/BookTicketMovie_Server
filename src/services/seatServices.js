import db from "../app/models";
import cinemaServices from "./cinemaServices";

class SeatServices {
  async getSeatOverviewByShowId(showId) {
    try {
      const detailShow = await db.Show.findOne({
        where: {
          id: showId,
        },
        include: [
          {
            model: db.MovieHall,
            include: [
              {
                model: db.RoomType,
              },
              {
                model: db.Cinema,
                include: [
                  {
                    model: db.SeatType,
                  },
                ],
              },
              {
                model: db.Layout,
                include: [
                  {
                    model: db.Seat,
                    include: [
                      {
                        model: db.SeatType,
                      },
                      // {
                      //   model: db.SeatStatus,
                      // },
                    ],
                  },
                ],
              },
            ],
          },

          {
            model: db.Movie,
          },
        ],
      });

      if (!detailShow) {
        return {
          statusCode: 1,
          message: "Không tìm thấy ghế",
        };
      }

      const allSeats = await db.SeatStatus.findAll({
        where: {
          showId: showId,
        },
        include: [
          {
            model: db.Seat,
            // where: {
            //   layoutId: detailShow.MovieHall.Layout.id,
            // },
            include: [
              {
                model: db.SeatType,
              },
            ],
          },
        ],
      });

      return {
        statusCode: 0,
        message: "Lấy seats thành công",
        data: detailShow,
        seatPicked: allSeats,
      };
    } catch (error) {
      console.error("Error while fetching shows:", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình lấy dữ liệu show",
      };
    }
  }

  async createSeat({ name, rowNumber, seatNumber, seatTypeId, layoutId }) {
    try {
      const seatDoc = await db.Seat.create({
        name,
        rowNumber,
        seatNumber,
        seatTypeId,
        layoutId,
      });
      if (!seatDoc) {
        return {
          statusCode: 1,
          message: "Thêm ghế thất bại",
        };
      }
      return {
        statusCode: 0,
        message: "Thêm ghế thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình createSeat",
      };
    }
  }

  async getAllSeatType(staffId) {
    try {
      const cinemaDoc = await cinemaServices.getCinemaByStaff(staffId);

      if (cinemaDoc.statusCode != 0) {
        return {
          statusCode: 1,
          message: "Không tìm thấy dữ liệu",
        };
      }

      const seatTypeDoc = await db.SeatType.findAll({
        where: {
          cinemaId: cinemaDoc.data.id,
        },
        order: [["createdAt", "DESC"]],
      });

      return {
        statusCode: 0,
        message: "Lấy dữ liệu thành công",
        data: seatTypeDoc,
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình getAllSeatType",
      };
    }
  }

  async creatSeatType({ color, staffId, name, price }) {
    try {
      const cinemaDoc = await cinemaServices.getCinemaByStaff(staffId);

      if (cinemaDoc.statusCode != 0) {
        return {
          statusCode: 1,
          message: "Không tìm thấy dữ liệu",
        };
      }

      const checkName = await db.SeatType.findOne({
        where: {
          name: name,
        },
      });

      if (checkName) {
        return {
          statusCode: 1,
          message: "Tên bạn chọn đã tồn tại, hãy chọn tên khác",
        };
      }

      const seatTypeDoc = await db.SeatType.create({
        color,
        name,
        price,
        cinemaId: cinemaDoc.data.id,
      });

      return {
        statusCode: 0,
        message: "Tạo loại ghế thành công",
        data: seatTypeDoc,
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình creatSeatType",
      };
    }
  }

  async updateSeatType({ color, name, price, id, cinemaId }) {
    try {
      const seatTypeDoc = await db.SeatType.findByPk(id);

      if (seatTypeDoc.name != name) {
        const checkName = await db.SeatType.findOne({
          where: {
            name: name,
          },
        });

        if (checkName) {
          return {
            statusCode: 1,
            message: "Tên bạn chọn đã tồn tại, hãy chọn tên khác",
          };
        }
      }

      if (seatTypeDoc.color != color) {
        const checkColor = await db.SeatType.findOne({
          where: {
            color: color,
          },
        });

        if (checkColor) {
          return {
            statusCode: 1,
            message: "Màu sắc thể hiện bạn chọn đã tồn tại, hãy chọn tên khác",
          };
        }
      }

      await seatTypeDoc.update({
        color,
        name,
        price,
        cinemaId,
      });

      return {
        statusCode: 0,
        message: "Tạo loại ghế thành công",
        data: seatTypeDoc,
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình updateSeatType",
      };
    }
  }
}

export default new SeatServices();
