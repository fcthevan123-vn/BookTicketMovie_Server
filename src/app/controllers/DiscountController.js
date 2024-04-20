import { validationResult } from "express-validator";
import { discountServices } from "../../services";

class DiscountController {
  async handleCreateDiscount(req, res) {
    const data = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: errors.array(),
      });
    }

    try {
      const response = await discountServices.createDiscount({ data });
      if (response.statusCode == 0) {
        return res.status(200).json(response);
      }
      return res.status(401).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleCreateDiscount",
        err: error.message,
      });
    }
  }

  async handleGetAllDiscount(req, res) {
    try {
      const response = await discountServices.getAllDiscount();
      if (response.statusCode == 0) {
        return res.status(200).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetAllDiscount",
        err: error.message,
      });
    }
  }

  async handleGetDiscountById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Thiếu id nhập vào",
      });
    }
    try {
      const response = await discountServices.getDiscountById();
      if (response.statusCode == 0) {
        return res.status(200).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleGetDiscountById",
        err: error.message,
      });
    }
  }

  async handleDeleteDiscount(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Thiếu id nhập vào",
      });
    }
    try {
      const response = await discountServices.deleteDiscount(id);
      if (response.statusCode == 0) {
        return res.status(200).json(response);
      }
      return res.status(401).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleDeleteDiscount",
        err: error.message,
      });
    }
  }

  async handleUpdateDiscount(req, res) {
    const data = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: errors.array(),
      });
    }
    if (!data.id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Thiếu id nhập vào",
      });
    }

    try {
      const response = await discountServices.updateDiscount({ data });
      if (response.statusCode == 0) {
        return res.status(200).json(response);
      }
      return res.status(401).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleUpdateDiscount",
        err: error.message,
      });
    }
  }

  async handleApplyDiscount(req, res) {
    const { idDiscount, moviesPicked } = req.body;

    if (!idDiscount || !moviesPicked) {
      return res.status(401).json({
        statusCode: 1,
        message: "Dữ liệu đầu vào không hợp lệ",
      });
    }

    try {
      const response = await discountServices.applyDiscount(
        idDiscount,
        moviesPicked
      );
      if (response.statusCode == 0) {
        return res.status(200).json(response);
      }
      return res.status(401).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Có lỗi tại handleApplyDiscount",
        err: error.message,
      });
    }
  }

  async handleCheckValidDiscount(req, res) {
    const { nameDiscount } = req.query;
    try {
      if (!nameDiscount) {
        return res.status(401).json({
          statusCode: 1,
          message: "Thiếu id nhập vào",
        });
      }
      const response = await discountServices.checkValidDiscount(nameDiscount);
      if (response.statusCode == 0) {
        return res.status(200).json(response);
      }
      return res.status(401).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi tại handleCheckValidDiscount",
        err: error.message,
      });
    }
  }
}
export default new DiscountController();
