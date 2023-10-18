import db from "../app/models";

class LayoutServices {
  // Create Layout
  async createLayout({ name, rows, seatsPerRow }) {
    try {
      const layout = await db.Layout.create({
        name,
        rows,
        seatsPerRow,
      });

      return {
        statusCode: 0,
        message: "Tạo layout thành công",
        data: layout,
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi tạo layout",
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
