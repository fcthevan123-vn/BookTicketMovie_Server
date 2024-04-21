/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Show extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Show.hasMany(models.Booking, {
        foreignKey: "showId",
      });
      Show.belongsTo(models.Movie, {
        foreignKey: "movieId",
      });
      Show.belongsTo(models.MovieHall, {
        foreignKey: "movieHallId",
      });
      Show.hasMany(models.SeatStatus, {
        foreignKey: "showId",
      });
    }
  }
  Show.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      movieId: DataTypes.UUID,
      date: DataTypes.DATEONLY,
      movieHallId: DataTypes.UUID,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Show",
    }
  );
  return Show;
};
