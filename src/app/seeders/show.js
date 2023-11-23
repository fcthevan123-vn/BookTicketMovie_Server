"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Shows",
      [
        {
          id: "c83a15d0-2226-4779-9464-e903591cabf7",
          startTime: "08:30",
          endTime: "10:33",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          date: "2023-12-05",
          movieHallId: "30ee4983-a7c0-4045-ae96-0edfc5b8479e",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T05:58:44.739Z",
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
