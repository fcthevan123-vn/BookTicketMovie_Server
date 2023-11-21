/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Booking, {
        foreignKey: "userId",
      });
      User.hasMany(models.Booking, {
        foreignKey: "staffId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      isVerifyEmail: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      address: DataTypes.STRING,
      count: DataTypes.INTEGER,
      sex: DataTypes.INTEGER,
      age: DataTypes.INTEGER,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
