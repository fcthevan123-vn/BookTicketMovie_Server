import db from "../app/models";

class ReviewServices {
  async createReview({ userId, movieId, star, content }) {
    try {
      const checkReviewExited = await db.Review.findOne({
        where: {
          userId: userId,
        },
      });

      if (checkReviewExited) {
        return {
          statusCode: 2,
          message:
            "Bạn đã đánh giá phim này rồi, vui lòng xem đánh giá của bạn và chỉnh sửa nếu muốn.",
        };
      }

      const reviewDoc = await db.Review.create({
        userId,
        movieId,
        star,
        content,
      });

      if (!reviewDoc) {
        return {
          statusCode: 1,
          message: "Đánh giá không thành công",
        };
      }

      return {
        statusCode: 0,
        message: "Đánh giá thành công",
        data: reviewDoc,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 3,
        message: "Đã có lỗi xảy ra tại createReview",
      };
    }
  }

  async updateReview({ id, star, content }) {
    try {
      const review = await db.Review.update(
        {
          star,
          content,
        },
        {
          where: { id },
        }
      );
      if (!review) {
        return {
          statusCode: 1,
          message: "Đánh giá không tồn tại",
        };
      }

      return {
        statusCode: 0,
        message: "Sửa đánh giá thành công",
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi cập nhật rạp phim",
      };
    }
  }

  async deteleReview({ id }) {
    try {
      const reviewExisted = await db.Review.findOne({ where: { id } });
      if (!reviewExisted) {
        return {
          statusCode: 1,
          message: "Đánh giá này không tồn tại",
        };
      }

      await db.Review.destroy({
        where: { id: id },
      });

      return {
        statusCode: 0,
        message: "Xoá đánh giá thành công",
      };
    } catch (error) {
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi deteleReview",
      };
    }
  }

  async getAllReviewOfMovie({ movieId }) {
    try {
      const reviewExisted = await db.Review.findAll({
        where: { movieId: movieId },
        include: [
          {
            model: db.User,
            attributes: ["fullName"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!reviewExisted) {
        return {
          statusCode: 1,
          message: "Không tìm thấy đánh giá nào.",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy đánh giá thành công",
        data: reviewExisted,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi getAllReviewOfMovie",
      };
    }
  }

  async getReviewOfUserInMovie({ movieId, userId }) {
    try {
      const reviewExisted = await db.Review.findAll({
        where: { movieId: movieId, userId: userId },
        include: [
          {
            model: db.User,
            attributes: ["fullName"],
          },
        ],
      });
      if (!reviewExisted) {
        return {
          statusCode: 1,
          message: "Không tìm thấy đánh giá nào.",
        };
      }

      return {
        statusCode: 0,
        message: "Lấy đánh giá thành công",
        data: reviewExisted,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi getReviewOfUserInMovie",
      };
    }
  }

  async checkUserCanReview({ movieId, userId }) {
    try {
      const userWatchedMovie = await db.Booking.findOne({
        where: { userId: userId },
        include: [
          {
            model: db.Show,
            include: [
              {
                model: db.Movie,
                where: {
                  id: movieId,
                },
              },
            ],
          },
        ],
      });
      if (!userWatchedMovie.Show) {
        return {
          statusCode: 0,
          check: false,
          message: "Người dùng chưa xem phim này",
        };
      }

      return {
        statusCode: 0,
        check: true,
        message: "Người dùng có thể đánh giá",
        data: userWatchedMovie,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi checkUserCanReview",
      };
    }
  }
}

export default new ReviewServices();
