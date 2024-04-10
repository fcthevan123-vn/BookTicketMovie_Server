/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discount.hasMany(models.Movie, {
        foreignKey: "discountId",
      });
      Discount.hasOne(models.Event, {
        foreignKey: "discountId",
      });
    }
  }
  Discount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nameDiscount: DataTypes.STRING,
      percentDiscount: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      startDate: DataTypes.STRING,
      endDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Discount",
    }
  );
  return Discount;
};
