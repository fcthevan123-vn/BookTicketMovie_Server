/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.hasMany(models.Show, {
        foreignKey: "movieId",
      });
      Movie.hasMany(models.Review, {
        foreignKey: "movieId",
      });
      Movie.belongsTo(models.Discount, {
        foreignKey: "discountId",
      });
    }
  }
  Movie.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      discountId: DataTypes.UUID,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      directors: DataTypes.ARRAY(DataTypes.STRING),
      actors: DataTypes.ARRAY(DataTypes.STRING),
      language: DataTypes.STRING,
      country: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      releaseDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      images: DataTypes.ARRAY(DataTypes.STRING),
      genre: DataTypes.ARRAY(DataTypes.STRING),
      duration: DataTypes.INTEGER,
      ageRequire: DataTypes.INTEGER,
      trailerLink: DataTypes.STRING,
      countBooked: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
