import db from "../app/models";

function generateSeatMatrix(
  rows,
  seatsPerRow,
  normalRows,
  vipRows,
  sweetRows,
  seatTypes,
  layoutId
) {
  const seatMatrix = [];
  let rowIndex = 1;

  for (let row = 1; row <= rows; row++) {
    const seatType = determineSeatType(
      rowIndex,
      normalRows,
      vipRows,
      sweetRows
    );

    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
      const seatId = `${String.fromCharCode(64 + row)}${seatNumber}`;

      seatMatrix.push({
        name: seatId,
        rowNumber: row,
        seatNumber: seatNumber,
        seatTypeId: seatTypes[seatType],
        layoutId: layoutId,
      });
    }

    rowIndex++;
  }

  return seatMatrix;
}

function determineSeatType(rowIndex, normalRows, vipRows, sweetRows) {
  if (rowIndex <= normalRows) {
    return "normal";
  } else if (rowIndex <= normalRows + vipRows) {
    return "vip";
  } else {
    return "sweet";
  }
}

class LayoutServices {
  // Create Layout
  async createLayout({
    name,
    rows,
    seatsPerRow,
    normalRows,
    sweetRows,
    vipRows,
  }) {
    try {
      const layout = await db.Layout.create({
        name,
        rows,
        seatsPerRow,
      });

      const seatTypes = {
        normal: "e7b000b0-caee-44b1-b52c-634c582c6abd",
        vip: "6bd9d903-f0da-4a15-a1da-a6666660e1ec",
        sweet: "b0e7b9df-d4ef-4ecf-a92b-0805c8d57a24",
      };

      const seatMatrix = generateSeatMatrix(
        rows,
        seatsPerRow,
        normalRows,
        vipRows,
        sweetRows,
        seatTypes,
        layout.id
      );

      for (const seat of seatMatrix) {
        await db.Seat.create(seat);
      }

      // // Create seats and associate them with the layout
      // const seats = await db.Seat.bulkCreate(
      //   seatMatrix.map((seat) => ({
      //     name: seat.name,
      //     rowNumber: seat.rowNumber,
      //     seatNumber: seat.seatNumber,
      //     seatTypeId: seatTypes[seat.seatTypeId],
      //     layoutId: layout.id,
      //   }))
      // );

      return {
        statusCode: 0,
        message: "Tạo layout và ghế thành công",
        data: { layout, seatMatrix },
        dataOrgin: {
          name,
          rows,
          seatsPerRow,
          normalRows,
          sweetRows,
          vipRows,
        },
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
        message: "Có lỗi xảy ra khi tìm layout",
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
        message: "Có lỗi xảy ra khi tìm layout",
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
}

export default new LayoutServices();
