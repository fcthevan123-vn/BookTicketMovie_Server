import reviewServices from "../../services/reviewServices";

class ReviewController {
  async handleCreateReview(req, res) {
    try {
      const { userId, movieId, star, content } = req.body;
      if (!userId || !movieId || !star || !content) {
        return res.status(500).json({
          statusCode: 1,
          message: "Nhập thiếu dữ liệu",
        });
      }
      const response = await reviewServices.createReview({
        userId,
        movieId,
        star,
        content,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleCreatReview",
      });
    }
  }

  async handleUpdateReview(req, res) {
    try {
      const { id, star, content } = req.body;
      if (!id || !star || !content) {
        return res.status(500).json({
          statusCode: 1,
          message: "Nhập thiếu dữ liệu",
        });
      }
      const response = await reviewServices.updateReview({
        id,
        star,
        content,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleUpdateReview",
      });
    }
  }

  async handleDeleteReview(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(500).json({
          statusCode: 1,
          message: "Nhập thiếu dữ liệu",
        });
      }
      const response = await reviewServices.deteleReview({
        id,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleDeleteReview",
      });
    }
  }

  async handleGetAllReviewOfMovie(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(500).json({
          statusCode: 1,
          message: "Nhập thiếu dữ liệu",
        });
      }
      const response = await reviewServices.getAllReviewOfMovie({
        movieId: id,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handGetAllReviewOfMovie",
      });
    }
  }

  async handleGetReviewOfUserInMovie(req, res) {
    try {
      const { movieId, userId } = req.query;
      if (!movieId || !userId) {
        return res.status(500).json({
          statusCode: 1,
          message: "Nhập thiếu dữ liệu",
        });
      }
      const response = await reviewServices.getReviewOfUserInMovie({
        movieId,
        userId,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handGetAllReviewOfMovie",
      });
    }
  }
  async handleCheckReviewOfUser(req, res) {
    try {
      const { movieId, userId } = req.query;
      if (!movieId || !userId) {
        return res.status(500).json({
          statusCode: 1,
          message: "Nhập thiếu dữ liệu",
        });
      }
      const response = await reviewServices.checkUserCanReview({
        movieId,
        userId,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statusCode: 1,
        message: "Có lỗi xảy ra tại handleCheckReviewOfUser",
      });
    }
  }
}

export default new ReviewController();
