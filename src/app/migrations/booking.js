"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      userId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      staffId: {
        allowNull: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      discountId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.UUID,
      },
      note: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      showId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      paymentMethod: {
        type: Sequelize.STRING,
        defaultValue: "Trực tiếp",
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Chờ xác nhận",
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bookings");
  },
};
