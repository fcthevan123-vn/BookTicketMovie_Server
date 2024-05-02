/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "staffId",
        as: "Staff",
      });
      Booking.belongsTo(models.Show, {
        foreignKey: "showId",
      });
      Booking.belongsTo(models.Discount, {
        foreignKey: "discountId",
      });
      Booking.hasMany(models.SeatStatus, {
        foreignKey: "bookingId",
      });
      Booking.hasMany(models.OrderFood, {
        foreignKey: "bookingId",
      });
      // Payment here (update soon)
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: DataTypes.UUID,
      staffId: DataTypes.UUID,
      discountId: DataTypes.UUID,
      showId: DataTypes.UUID,
      totalPrice: DataTypes.INTEGER,
      paymentMethod: DataTypes.STRING,
      status: DataTypes.STRING,
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
