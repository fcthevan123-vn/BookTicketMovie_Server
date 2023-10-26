/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SeatStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeatStatus.belongsTo(models.Seat, {
        foreignKey: "seatId",
      });
      SeatStatus.belongsTo(models.Show, {
        foreignKey: "showId",
      });
      SeatStatus.belongsTo(models.Booking, {
        foreignKey: "bookingId",
      });
    }
  }
  SeatStatus.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      seatId: DataTypes.UUID,
      showId: DataTypes.UUID,
      bookingId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "SeatStatus",
    }
  );
  return SeatStatus;
};
