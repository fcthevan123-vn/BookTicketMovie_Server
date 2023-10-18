import db from "../app/models";

class RoomTypeServices {
  // Create RoomType
  async createRoomType({ priceMultiplier, name }) {
    try {
      const roomType = await db.RoomType.create({
        priceMultiplier,
        name,
      });

      return {
        statusCode: 0,
        message: "Tạo loại phòng thành công",
        data: roomType,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tạo loại phòng",
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
  async readAllRoomType() {
    try {
      const roomType = await db.RoomType.findAll();

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

  // Update RoomType
  async updateRoomType(id, { priceMultiplier, name }) {
    try {
      const roomType = await db.RoomType.findByPk(id);

      if (!roomType) {
        return {
          statusCode: 1,
          message: "Không tìm thấy loại phòng",
        };
      }

      roomType.priceMultiplier = priceMultiplier;
      roomType.name = name;

      await roomType.save();

      return {
        statusCode: 0,
        message: "Cập nhật loại phòng thành công",
        data: roomType,
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
