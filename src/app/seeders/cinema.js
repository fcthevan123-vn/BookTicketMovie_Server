"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Cinemas",
      [
        {
          id: "399e049f-345c-4b6a-bca7-cf91abbdb85f",
          name: "Rạp chiếu CGV",
          location: ["1", "2", "49"],
          detailLocation: "Near Park 1",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "4f7d6e71-60c1-41e5-8674-534ad93c7f31",
          name: "Rạp chiếu CGV",
          location: ["1", "3", "94"],
          detailLocation: "Near Park 1",
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
