/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoomType.hasMany(models.MovieHall, {
        foreignKey: "roomTypeId",
      });
    }
  }
  RoomType.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      priceMultiplier: DataTypes.DECIMAL(10, 2),
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomType",
    }
  );
  return RoomType;
};
