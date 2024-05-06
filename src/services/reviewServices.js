import db from "../app/models";

class ReviewServices {
  async createReview({ userId, movieId, star, content }) {
    try {
      const checkReviewExited = await db.Review.findOne({
        where: {
          userId: userId,
          movieId: movieId,
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
        date: new Date(),
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

  async getAllReviewsOfUser({ userId }) {
    try {
      const reviewExisted = await db.Review.findAll({
        where: { userId: userId },
        include: [
          {
            model: db.Movie,
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

  async getAllReview() {
    try {
      const reviewDoc = await db.Review.findAll({
        order: [["updatedAt", "DESC"]],
      });

      return {
        statusCode: 0,
        message: "Lấy đánh giá thành công",
        data: reviewDoc,
      };
    } catch (error) {
      console.log("error", error);
      return {
        statusCode: 2,
        message: "Có lỗi xảy ra khi getAllReview",
      };
    }
  }

  async calculateStar({ movieId }) {
    try {
      const movieDoc = await db.Movie.findByPk(movieId);
      if (!movieDoc) {
        return {
          statusCode: 2,
          message: "Không tìm thấy phim",
        };
      }

      const reviews = await db.Review.findAll({
        where: { movieId: movieId },
        attributes: ["star"],
      });

      const totalCount = reviews.length;
      let totalStars = 0;
      const starCounts = Array(5).fill(0);

      for (const review of reviews) {
        totalStars += review.star;
        starCounts[review.star - 1]++;
      }

      const average = totalCount > 0 ? totalStars / totalCount : 0;

      const counts = starCounts.map((count, index) => ({
        rating: index + 1,
        count: count,
      }));

      return {
        statusCode: 0,
        data: {
          totalCount: totalCount,
          average,
          counts,
        },
        movieData: movieDoc,
      };
    } catch (error) {
      console.error("Có lỗi xảy ra tại calculateStar:", error);
      return {
        statusCode: 1,
        message: "Có lỗi xảy ra tại calculateStar",
      };
    }
  }

  async checkUserCanReview({ movieId, userId }) {
    try {
      const userWatchedMovie = await db.Booking.findAll({
        where: { userId: userId, status: "Đã nhận vé" },
        include: [
          {
            model: db.Show,
            where: { movieId: movieId },
            include: [
              {
                model: db.Movie,
              },
            ],
          },
        ],
      });
      if (userWatchedMovie.length <= 0) {
        return {
          statusCode: 0,
          check: false,
          data: userWatchedMovie,
          message: "Người dùng chưa xem phim này",
        };
      }

      return {
        statusCode: 0,
        check: true,
        message: "Người dùng có thể đánh giá",
        data: userWatchedMovie,
        movieId: movieId,
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
