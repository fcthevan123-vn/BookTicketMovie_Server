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
        {
          id: "d28d0a8e-7b34-4c2c-b50d-6f9d750820e3",
          number: 0,
          name: "Phòng 4D Max",
          status: "open",
          roomTypeId: "28e883e6-5de5-4996-9314-aef43731690b",
          cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          layoutId: "07c824c5-64b4-4f13-85d7-7cbe26285b38",
          createdAt: "2024-05-05T06:41:35.276Z",
          updatedAt: "2024-05-05T06:41:35.276Z",
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
