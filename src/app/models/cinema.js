/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cinema extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cinema.hasMany(models.MovieHall, {
        foreignKey: "cinemaId",
      });
    }
  }
  Cinema.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      location: DataTypes.ARRAY(DataTypes.STRING),
      detailLocation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cinema",
    }
  );

  return Cinema;
};
