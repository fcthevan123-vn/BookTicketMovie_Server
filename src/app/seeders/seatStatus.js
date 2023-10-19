"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "SeatStatuses",
      [
        {
          id: "a45c620c-17c2-4f73-9aef-cff740d9c7aa",
          name: "Đã được đặt",
          isBooked: true,
          seatId: "f03bf574-96c0-4dcd-aea3-ee797353c596",
          showId: "c83a15d0-2226-4779-9464-e903591cabf7",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "c90c7edd-0129-488c-b8bc-a9e7d60ed9ed",
          name: "Đã được đặt",
          isBooked: true,
          seatId: "ab4363dd-b591-4849-88ed-e5b904f7a3af",
          showId: "c83a15d0-2226-4779-9464-e903591cabf7",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
