/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seat.belongsTo(models.Layout, {
        foreignKey: "layoutId",
      });
      Seat.belongsTo(models.SeatType, {
        foreignKey: "seatTypeId",
      });
      Seat.hasMany(models.SeatStatus, {
        foreignKey: "seatId",
      });
    }
  }
  Seat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      rowNumber: DataTypes.INTEGER,
      seatNumber: DataTypes.INTEGER,
      seatTypeId: DataTypes.UUID,
      layoutId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Seat",
    }
  );
  return Seat;
};
