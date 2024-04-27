/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieHall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MovieHall.belongsTo(models.Cinema, {
        foreignKey: "cinemaId",
      });
      MovieHall.belongsTo(models.Layout, {
        foreignKey: "layoutId",
      });
      MovieHall.belongsTo(models.RoomType, {
        foreignKey: "roomTypeId",
      });
      MovieHall.hasMany(models.Show, {
        foreignKey: "movieHallId",
      });
    }
  }
  MovieHall.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      number: DataTypes.INTEGER,
      name: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "open",
      },
      roomTypeId: DataTypes.UUID,
      cinemaId: DataTypes.UUID,
      layoutId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "MovieHall",
    }
  );

  return MovieHall;
};
