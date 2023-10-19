"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Bookings",
      [
        {
          id: "37556930-b699-486c-bbec-805a7de77dff",
          userId: "33f3892a-b3dd-4c49-9838-3138797f989c",
          showId: "c83a15d0-2226-4779-9464-e903591cabf7",
          isPaid: true,
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "fc182821-aba8-43d1-b753-92296f8baffd",
          userId: "33f3892a-b3dd-4c49-9838-3138797f989c",
          showId: "c83a15d0-2226-4779-9464-e903591cabf7",
          isPaid: true,
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
