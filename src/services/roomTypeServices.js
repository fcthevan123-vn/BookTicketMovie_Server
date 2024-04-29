import db from "../app/models";

async function checkVadidName(name, cinemaId) {
  try {
    const response = await db.RoomType.findOne({
      where: {
        name: name,
        cinemaId: cinemaId,
      },
    });

    if (response) {
      return {
        statusCode: 1,
        message: "Đã tồn tại tên",
      };
    }

    return {
      statusCode: 0,
      message: "Tên hợp lệ",
    };
  } catch (error) {
    return {
      statusCode: -1,
      message: "Có lỗi xảy ra khi lấy dữ liệu",
    };
  }
}

class RoomTypeServices {
  // Create RoomType
  async createRoomType({ name, priceNormal, priceHoliday, cinemaId }) {
    try {
      const checkName = await checkVadidName(name, cinemaId);

      if (checkName.statusCode != 0) {
        return {
          statusCode: 1,
          message: "Tên kiểu phòng này đã được sửa dụng, hãy chọn tên khác",
        };
      }

      const roomType = await db.RoomType.create({
        priceMultiplier: 0,
        name,
        priceNormal,
        priceHoliday,
        cinemaId,
      });

      return {
        statusCode: 0,
        message: "Tạo kiểu phòng thành công",
        data: roomType,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tạo kiểu phòng",
      };
    }
  }

  // Read RoomType
  async readRoomType(id) {
    try {
      const roomType = await db.RoomType.findByPk(id);

      if (!roomType) {
        return {
          statusCode: 1,
          message: "Không tìm thấy loại phòng",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy loại phòng",
        data: roomType,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm loại phòng",
      };
    }
  }

  // Read ALL RoomType
  async getAllRoomType(staffId) {
    try {
      let roomType = await db.RoomType.findAll();

      if (staffId) {
        roomType = await db.User.findOne({
          where: {
            id: staffId,
          },
          include: [
            {
              model: db.Cinema,
              include: [
                {
                  model: db.RoomType,
                },
              ],
            },
          ],
          order: [["createdAt", "DESC"]],
          nest: true,
        });
      }

      if (!roomType) {
        return {
          statusCode: 1,
          message: "Không tìm thấy kiểu phòng",
        };
      }

      return {
        statusCode: 0,
        message: "Tìm thấy kiểu phòng",
        data: roomType,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tìm kiểu phòng",
      };
    }
  }

  // Update RoomType
  async updateRoomType({ id, name, priceNormal, priceHoliday, cinemaId }) {
    try {
      const roomType = await db.RoomType.findByPk(id);

      if (!roomType) {
        return {
          statusCode: 1,
          message: "Không tìm thấy kiểu phòng",
        };
      }

      if (name != roomType.name) {
        const checkName = await checkVadidName(name, cinemaId);

        if (checkName.statusCode != 0) {
          return {
            statusCode: 1,
            message: "Tên kiểu phòng này đã được sửa dụng, hãy chọn tên khác",
          };
        }
      }

      roomType.name = name;
      roomType.priceNormal = priceNormal;
      roomType.priceHoliday = priceHoliday;

      await roomType.save();

      return {
        statusCode: 0,
        message: "Cập nhật kiểu phòng thành công",
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi cập nhật loại phòng",
      };
    }
  }

  // Delete RoomType
  async deleteRoomType(id) {
    try {
      const roomType = await db.RoomType.findByPk(id);

      if (!roomType) {
        return {
          statusCode: 1,
          message: "Không tìm thấy loại phòng",
        };
      }

      await roomType.destroy();

      return {
        statusCode: 0,
        message: "Xóa loại phòng thành công",
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi xóa loại phòng",
      };
    }
  }
}

export default new RoomTypeServices();
