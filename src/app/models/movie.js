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
    }
  }
  Movie.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      director: DataTypes.STRING,
      actors: DataTypes.STRING,
      language: DataTypes.STRING,
      country: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      dubbing: DataTypes.STRING,
      releaseDate: DataTypes.DATE,
      image: DataTypes.STRING,
      genre: DataTypes.STRING,
      duration: DataTypes.DATE,
      ageRequire: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
