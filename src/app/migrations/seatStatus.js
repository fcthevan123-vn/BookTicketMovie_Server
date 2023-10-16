"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SeatStatuses", {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      isBooked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      seatId: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      // showId: {
      //   allowNull: false,
      //   type: Sequelize.UUID,
      //   defaultValue: Sequelize.UUIDV4,
      // },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SeatStatuses");
  },
};
