"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "RoomTypes",
      [
        {
          id: "20309041-b52c-4aaa-9b9e-60278bd6541a",
          name: "Mặc định",
          cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          priceMultiplier: 1.2,
          status: "open",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
          priceNormal: [50000, 70000, 50000],
          priceHoliday: [60000, 95000, 70000],
        },
        {
          id: "28e883e6-5de5-4996-9314-aef43731690b",
          status: "open",
          cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          priceMultiplier: "0.00",
          name: "Phòng Gold",
          priceNormal: [80000, 90000, 10000],
          priceHoliday: [100000, 110000, 120000],
          createdAt: "2024-05-05T06:36:15.110Z",
          updatedAt: "2024-05-05T06:36:15.110Z",
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
