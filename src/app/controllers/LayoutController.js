import { layoutServices } from "../../services";

class LayoutController {
  // Create Layout Controller
  async handleCreateLayout(req, res) {
    const { name, rows, seatsPerRow } = req.body;
    if (!name || !rows || !seatsPerRow) {
      return res.status(401).json({
        statusCode: 1,
        message: "Nhập thiếu thông tin",
      });
    }
    try {
      const response = await layoutServices.createLayout({
        name,
        rows,
        seatsPerRow,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleCreateLayout", err: error.message });
    }
  }

  // Read Layout Controller
  async handleReadLayout(req, res) {
    const { id } = req.params;
    try {
      const response = await layoutServices.readLayout(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleReadLayout", err: error.message });
    }
  }

  // Read All Layout Controller
  async handleReadAllLayout(req, res) {
    try {
      const response = await layoutServices.readAllLayout();
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleReadLayout", err: error.message });
    }
  }

  // Update Layout Controller
  async handleUpdateLayout(req, res) {
    const { id } = req.params;
    const { name, rows, seatsPerRow } = req.body;
    try {
      const response = await layoutServices.updateLayout(id, {
        name,
        rows,
        seatsPerRow,
      });
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleUpdateLayout", err: error.message });
    }
  }

  // Delete Layout Controller
  async handleDeleteLayout(req, res) {
    const { id } = req.params;
    try {
      const response = await layoutServices.deleteLayout(id);
      if (response.statusCode === 0) {
        return res.status(200).json(response);
      }
      return res.status(400).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Có lỗi tại handleDeleteLayout", err: error.message });
    }
  }
}
export default new LayoutController();
