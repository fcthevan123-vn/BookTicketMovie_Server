import { where } from "sequelize";
import db from "../app/models";
import cinemaServices from "./cinemaServices";

function generateSeatMatrix(seatsPerRow, layout, layoutId) {
  const seatMatrix = [];
  let rowIndex = 1;
  let count = 1;

  for (const item of layout) {
    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
      if (count > parseInt(item.rows)) {
        count = 1;
        break;
      }

      const seatName = `${String.fromCharCode(64 + rowIndex)}${seatNumber}`;

      seatMatrix.push({
        name: seatName,
        rowNumber: rowIndex,
        seatNumber: seatNumber,
        seatTypeId: item.seatType,
        layoutId: layoutId,
      });

      if (seatNumber == seatsPerRow && count <= item.rows) {
        count++;
        seatNumber = 0;
        rowIndex++;
      }
    }
  }

  return seatMatrix;
}

class LayoutServices {
  // Create Layout
  async createLayout({ layout, name, seatsPerRow, totalRows, staffId }) {
    try {
      const cinemaDoc = await cinemaServices.getCinemaByStaff(staffId);

      if (cinemaDoc.statusCode != 0) {
        return {
          statusCode: 1,
          message: cinemaDoc.message,
        };
      }

      const checkValidName = await db.Layout.findOne({
        where: {
          name: name,
        },
      });

      if (checkValidName) {
        return {
          statusCode: 1,
          message: "Tên đã trùng, vui lòng chọn tên khác",
        };
      }

      const layoutDoc = await db.Layout.create({
        name,
        rows: totalRows,
        seatsPerRow,
        status: "open",
        cinemaId: cinemaDoc.data.id,
      });

      if (!layoutDoc) {
        return {
          statusCode: 1,
          message: "Có lỗi xảy ra khi tạo layout",
        };
      }

      const seatMatrix = generateSeatMatrix(seatsPerRow, layout, layoutDoc.id);

      // for (const seat of seatMatrix) {
      //   await db.Seat.create(seat);
      // }

      // Create seats and associate them with the layout
      const seats = await db.Seat.bulkCreate(seatMatrix);

      if (!seats) {
        return {
          statusCode: 1,
          message: "Tạo layout thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo layout và ghế thành công",
        seatMatrix,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tạo layout và ghế",
      };
    }
  }

  // Read Layout
  async readLayout(id) {
    try {
      const layout = await db.Layout.findByPk(id);

      if (!layout) {
        return {
          statusCode: 1,
          message: "Không tìm thấy layout",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy layout",
        data: layout,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại readLayout",
      };
    }
  }

  // Read ALL Layout
  async readAllLayout() {
    try {
      const layout = await db.Layout.findAll();

      if (!layout) {
        return {
          statusCode: 1,
          message: "Không tìm thấy layout",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy layout",
        data: layout,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại readAllLayout",
      };
    }
  }

  // Update Layout
  async updateLayout(id, { name, rows, seatsPerRow }) {
    try {
      const layout = await db.Layout.findByPk(id);

      if (!layout) {
        return {
          statusCode: 1,
          message: "Không tìm thấy layout",
        };
      }

      layout.name = name;
      layout.rows = rows;
      layout.seatsPerRow = seatsPerRow;

      await layout.save();

      return {
        statusCode: 0,
        message: "Cập nhật layout thành công",
        data: layout,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi cập nhật layout",
      };
    }
  }

  // Delete Layout
  async deleteLayout(id) {
    try {
      const layout = await db.Layout.findByPk(id);

      if (!layout) {
        return {
          statusCode: 1,
          message: "Không tìm thấy layout",
        };
      }

      await layout.destroy();

      return {
        statusCode: 0,
        message: "Xóa layout thành công",
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi xóa layout",
      };
    }
  }

  async getAllLayoutByStaff(staffId) {
    try {
      const cinemaDoc = await cinemaServices.getCinemaByStaff(staffId);

      if (cinemaDoc.statusCode != 0) {
        return {
          statusCode: 1,
          message: "Không tìm thấy nhân viên",
        };
      }

      const layoutDoc = await db.Layout.findAll({
        where: {
          cinemaId: cinemaDoc.data.id,
        },
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
        order: [["createdAt", "DESC"]],
      });

      return {
        statusCode: 0,
        message: "Thành công",
        data: layoutDoc,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: -1,
        message: "Có lỗi xảy ra tại getAllLayoutByStaff",
        error: error.message,
      };
    }
  }
}

export default new LayoutServices();
