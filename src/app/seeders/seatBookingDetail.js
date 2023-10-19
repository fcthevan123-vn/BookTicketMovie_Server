"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "SeatBookingDetails",
      [
        {
          id: "ee1ba555-21b9-408a-a65e-add53c692f5c",
          bookingId: "37556930-b699-486c-bbec-805a7de77dff",
          seatId: "f03bf574-96c0-4dcd-aea3-ee797353c596",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "2812ffa5-0c98-4c7f-8789-06a823fe540a",
          bookingId: "37556930-b699-486c-bbec-805a7de77dff",
          seatId: "ab4363dd-b591-4849-88ed-e5b904f7a3af",
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
