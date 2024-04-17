/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Cinemas",
      [
        {
          id: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          name: "rap phim test",
          location: ["92", "916", "31149"],
          detailLocation: "Trung tâm thành phố Cần Thơ",
          createdAt: "2024-04-16T03:43:00.066Z",
          updatedAt: "2024-04-16T03:43:00.066Z",
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
