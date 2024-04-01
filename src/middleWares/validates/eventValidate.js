import { body } from "express-validator";

const validateEventInput = [
  body("title").notEmpty().withMessage("Trường tiêu đề là bắt buộc"),
  body("discount").notEmpty().withMessage("Trường mã giảm giá là bắt buộc"),
  body("content").notEmpty().withMessage("Trường nội dung là bắt buộc"),
  body("startDate").notEmpty().withMessage("Trường ngày bắt đầu là bắt buộc"),
  body("endDate").notEmpty().withMessage("Trường ngày kết thúc là bắt buộc"),
];

export { validateEventInput };
