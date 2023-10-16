"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Layouts",
      [
        {
          id: "38eb74e4-5ba3-4aa9-9959-2ca225ce9889",
          name: "Layout 1",
          rows: 8,
          seatsPerRow: 8,
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "b3d11cd2-e626-420b-9a27-cb666b7dc7e4",
          name: "Layout 2",
          rows: 10,
          seatsPerRow: 10,
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
