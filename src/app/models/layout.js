/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Layout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Layout.hasMany(models.MovieHall, {
        foreignKey: "layoutId",
      });
      Layout.hasMany(models.Seat, {
        foreignKey: "layoutId",
      });
      Layout.belongsTo(models.Cinema, {
        foreignKey: "cinemaId",
      });
    }
  }
  Layout.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cinemaId: DataTypes.UUID,
      name: DataTypes.STRING,
      rows: DataTypes.INTEGER,
      seatsPerRow: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Layout",
    }
  );
  return Layout;
};
