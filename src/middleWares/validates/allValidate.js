import { body } from "express-validator";

const validateDiscount = [
  body("nameDiscount")
    .notEmpty()
    .withMessage("Trường tên giảm giá là bắt buộc"),
  body("percentDiscount")
    .notEmpty()
    .withMessage("Trường phần trăm giảm giá là bắt buộc")
    .isInt({ min: 0, max: 1000000 })
    .withMessage("Phần trăm giảm giá phải là một số nguyên từ 0 đến 1000000"),
  body("quantity")
    .notEmpty()
    .withMessage("Trường số lượng là bắt buộc")
    .isInt({ min: 0 })
    .withMessage("Số lượng phải là một số nguyên không âm"),
  body("startDate")
    .notEmpty()
    .withMessage("Trường ngày bắt đầu là bắt buộc")
    .isISO8601()
    .toDate()
    .withMessage("Ngày bắt đầu không hợp lệ"),
  body("endDate")
    .notEmpty()
    .withMessage("Trường ngày kết thúc là bắt buộc")
    .isISO8601()
    .toDate()
    .withMessage("Ngày kết thúc không hợp lệ"),
];

export { validateDiscount };
