import { query, body } from "express-validator";

// Middleware kiểm tra dữ liệu đầu vào
const validateInputMovie = [
  query("page").notEmpty().withMessage("Thiếu số trang"),
  query("limit").notEmpty().withMessage("Thiếu giới hạn của dữ liệu"),
];

const validateCreateMovie = [
  body("title").notEmpty().withMessage("Trường tiêu đề là bắt buộc"),
  body("description").notEmpty().withMessage("Trường mô tả là bắt buộc"),
  body("ageRequire").notEmpty().withMessage("Trường yêu cầu tuổi là bắt buộc"),
  body("releaseDate")
    .notEmpty()
    .withMessage("Trường ngày phát hành là bắt buộc"),
  body("endDate").notEmpty().withMessage("Trường ngày kết thúc là bắt buộc"),
  body("duration").notEmpty().withMessage("Trường thời lượng là bắt buộc"),
  body("language").notEmpty().withMessage("Trường ngôn ngữ là bắt buộc"),
  body("country").notEmpty().withMessage("Trường quốc gia là bắt buộc"),
  body("price").notEmpty().withMessage("Trường giá là bắt buộc"),
  body("subtitle").notEmpty().withMessage("Trường phụ đề là bắt buộc"),
  body("directors").notEmpty().withMessage("Trường đạo diễn là bắt buộc"),
  body("actors").notEmpty().withMessage("Trường diễn viên là bắt buộc"),
  body("genre").notEmpty().withMessage("Trường thể loại là bắt buộc"),
];

export { validateInputMovie, validateCreateMovie };
