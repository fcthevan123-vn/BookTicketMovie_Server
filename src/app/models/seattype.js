/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SeatType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeatType.hasMany(models.Seat, {
        foreignKey: "seatTypeId",
      });
      SeatType.belongsTo(models.Cinema, {
        foreignKey: "cinemaId",
      });
    }
  }
  SeatType.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cinemaId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      color: DataTypes.STRING,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SeatType",
    }
  );
  return SeatType;
};
