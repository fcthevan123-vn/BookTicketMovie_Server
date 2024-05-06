/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Layouts", [
      {
        id: "38eb74e4-5ba3-4aa9-9959-2ca225ce9889",
        name: "8 x 8",
        cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
        rows: 8,
        status: "open",
        seatsPerRow: 8,
        createdAt: "2023-09-16T03:58:44.739Z",
        updatedAt: "2023-09-16T03:58:44.739Z",
      },
      {
        id: "07c824c5-64b4-4f13-85d7-7cbe26285b38",
        status: "open",
        cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
        name: "9 x 9",
        rows: 9,
        seatsPerRow: 9,
        createdAt: "2024-05-05T06:37:34.113Z",
        updatedAt: "2024-05-05T06:37:34.113Z",
      },
    ]);
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
