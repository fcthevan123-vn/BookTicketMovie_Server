/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: DataTypes.UUID,
      message: DataTypes.STRING,
      title: DataTypes.STRING,
      // accountType: DataTypes.STRING,
      linkNotification: DataTypes.STRING,
      typeNotification: {
        type: DataTypes.STRING,
        defaultValue: "default",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "unread",
      },
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
