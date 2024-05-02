/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderFood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderFood.belongsTo(models.Booking, {
        foreignKey: "bookingId",
      });
      OrderFood.belongsTo(models.MenuFood, {
        foreignKey: "menuFoodId",
      });
    }
  }
  OrderFood.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bookingId: DataTypes.UUID,
      menuFoodId: DataTypes.UUID,
      quantity: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderFood",
    }
  );
  return OrderFood;
};
