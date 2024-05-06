import { userServices } from "../../services";

class UserController {
  async handleRegister(req, res) {
    const { fullName, email, phone, password, address, sex, age } = req.body;
    const { isAdmin } = req.query;

    let type;

    if (isAdmin) {
      type = req.body.type;
    }

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !address ||
      !sex ||
      !age
    ) {
      return res.status(401).json({
        statusCode: 1,
        message: "Missing required fields",
      });
    }

    try {
      const response = await userServices.createUser({
        fullName,
        email,
        phone,
        password,
        address,
        sex,
        age,
        type,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(401).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error creating user.", err: error.message });
    }
  }

  async handleGetUserById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Missing required fields",
      });
    }

    try {
      const response = await userServices.getUserById({
        id,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error handleGetUserById", err: error.message });
    }
  }

  async handleGetAllUserByAdmin(req, res) {
    const { page, limit } = req.query;
    if (!page || !limit) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu dữ liệu",
      });
    }
    try {
      const response = await userServices.getAllUserByRule({ page, limit });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error handleGetUserById", err: error.message });
    }
  }

  async handleDeleteUser(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu id",
      });
    }
    try {
      const response = await userServices.deleteUserById({ id });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error handleGetUserById", err: error.message });
    }
  }

  async handleUpdateInfor(req, res) {
    const { id } = req.params;
    const { isAdmin } = req.query;
    const { fullName, phone, address, sex, age } = req.body;

    let email = "";
    let type = "";

    if (isAdmin) {
      email = req.body.email;
      type = req.body.type;
    }

    if (!id || !fullName || !phone || !address || !sex || !age) {
      return res.status(401).json({
        statusCode: 1,
        message: "Missing required fields",
      });
    }

    try {
      const response = await userServices.updateProfileUser({
        id,
        fullName,
        phone,
        address,
        sex,
        age,
        email,
        type,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error handleUpdateInfor", err: error.message });
    }
  }

  async handleChangePassword(req, res) {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!id || !oldPassword || !newPassword) {
      return res.status(401).json({
        statusCode: 1,
        message: "Missing required fields",
      });
    }

    try {
      const response = await userServices.changePassword({
        id,
        oldPassword,
        newPassword,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error handleChangePassword", err: error.message });
    }
  }

  async handleSearchUser(req, res) {
    const { name, page, limit } = req.query;
    if (!name && !page && !limit) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu dữ liệu ",
      });
    }

    try {
      const response = await userServices.searchUser({ name, page, limit });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error handleChangePassword", err: error.message });
    }
  }

  async handleGetStatisticUser(req, res) {
    try {
      const response = await userServices.statisticUser();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error handleGetStatisticUser", err: error.message });
    }
  }

  async handleGetStatisticRegisterUser(req, res) {
    try {
      const response = await userServices.statisticUserRegister();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error handleGetStatisticRegisterUser",
        err: error.message,
      });
    }
  }

  async handleSearchTypeUser(req, res) {
    const { type } = req.query;
    try {
      if (!type) {
        return res.status(401).json({
          statusCode: 1,
          message: "Nhập thiếu dữ liệu ",
        });
      }
      const response = await userServices.searchUserByType(type);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error handleSearchTypeUser",
        err: error.message,
      });
    }
  }

  async handleGetStatisticByAdmin(req, res) {
    try {
      const response = await userServices.adminGetQuantity();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error handleSearchTypeUser",
        err: error.message,
      });
    }
  }

  async handleStatisticBooking(req, res) {
    const { cinemaId, movieHallId, movieId, timeType } = req.query;
    try {
      const response = await userServices.statisticBookingAndCount({
        cinemaId,
        movieHallId,
        movieId,
        timeType,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error handleStatisticBooking",
        err: error.message,
      });
    }
  }

  async handleStatisticByDay(req, res) {
    const { date } = req.query;
    try {
      const response = await userServices.staticByday({
        date,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error handleStatisticBooking",
        err: error.message,
      });
    }
  }

  async handleStatisticCinema(req, res) {
    const { cinemaId } = req.query;
    try {
      const response = await userServices.statisticEmployee(cinemaId);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error handleStatisticBooking",
        err: error.message,
      });
    }
  }
}

export default new UserController();
