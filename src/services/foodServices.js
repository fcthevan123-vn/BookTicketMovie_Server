import { S3Controller } from "../app/controllers";
import db from "../app/models";

class FoodServices {
  async getAllFood(status) {
    try {
      let foodDoc;

      if (status != "-1") {
        foodDoc = await db.MenuFood.findAll({
          where: {
            status: status,
          },
        });
      } else {
        foodDoc = await db.MenuFood.findAll();
      }

      return {
        statusCode: 0,
        message: "Lấy dữ liệu thành công",
        data: foodDoc,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại getAllFood",
      };
    }
  }

  async changeStatusFood({ status, id }) {
    try {
      const foodDoc = await db.MenuFood.findByPk(id);

      if (!foodDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy dữ liệu",
        };
      }

      await foodDoc.update({
        status,
      });

      return {
        statusCode: 0,
        message: "Cập nhật thành công",
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại changeStatusFood",
      };
    }
  }

  async createFood({ name, price, image, status }) {
    try {
      console.log("name", name);

      const checkName = await db.MenuFood.findOne({
        where: {
          name: name,
        },
      });

      if (checkName) {
        await S3Controller.handleDelteImages(image);

        return {
          statusCode: 1,
          message: "Tên đã trùng, vui lòng chọn tên khác",
        };
      }

      const foodDoc = await db.MenuFood.create({
        name,
        price,
        image,
        status,
      });

      if (!foodDoc) {
        await S3Controller.handleDelteImages(image);
        return {
          statusCode: 1,
          message: "Tạo thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Tạo thành công",
        checkName,
      };
    } catch (error) {
      console.log("error", error.message);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra tại createFood",
      };
    }
  }

  async updateFood({ id, name, price, image, status }) {
    try {
      const foodDoc = await db.MenuFood.findByPk(id);

      if (!foodDoc) {
        return {
          statusCode: 1,
          message: "Không tìm thấy dữ liệu",
        };
      }

      if (name != foodDoc.name) {
        const checkName = await db.MenuFood.findOne({
          where: {
            name: name,
          },
        });

        if (checkName) {
          await S3Controller.handleDelteImages(image);

          return {
            statusCode: 1,
            message: "Tên đã trùng, vui lòng chọn tên khác",
          };
        }
      }

      // if (isNewFile) {
      //   await S3Controller.handleDelteImagesFromLink(foodDoc.image);
      // }

      if (!image) {
        await foodDoc.update({
          name,
          price,
          status,
        });
      } else {
        await S3Controller.handleDelteImagesFromLink(foodDoc.image);
        await foodDoc.update({
          name,
          price,
          status,
          image,
        });
      }

      if (!foodDoc) {
        if (image) {
          await S3Controller.handleDelteImages(image);
        }
        return {
          statusCode: 1,
          message: "Cập nhật thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật thành công",
      };
    } catch (error) {
      console.log("error", error.message);
      return {
        statusCode: 2,
        message: `Có lỗi xảy ra tại updateFood - ${error.message}`,
      };
    }
  }
}

export default new FoodServices();
