/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SeatBookingDetail extends Model {
    static associate(models) {
      SeatBookingDetail.belongsTo(models.Booking, {
        foreignKey: "bookingId",
      });
      SeatBookingDetail.belongsTo(models.Seat, {
        foreignKey: "seatId",
      });
    }
  }
  SeatBookingDetail.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bookingId: DataTypes.UUID,
      seatId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "SeatBookingDetail",
    }
  );
  return SeatBookingDetail;
};
