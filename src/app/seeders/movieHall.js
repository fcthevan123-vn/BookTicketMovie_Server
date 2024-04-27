/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "MovieHalls",
      [
        {
          id: "f00b2d4f-dc76-4fc3-9142-413be014f973",
          number: 1,
          name: "phòng chiếu Cần Thơ",
          status: "open",
          roomTypeId: "20309041-b52c-4aaa-9b9e-60278bd6541a",
          cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          layoutId: "38eb74e4-5ba3-4aa9-9959-2ca225ce9889",
          createdAt: "2024-04-16T03:45:07.802Z",
          updatedAt: "2024-04-16T03:45:07.802Z",
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
