"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SeatBookingDetails", {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      bookingId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      seatId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
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
    await queryInterface.dropTable("SeatBookingDetails");
  },
};
