"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "SeatTypes",
      [
        {
          id: "e7b000b0-caee-44b1-b52c-634c582c6abd",
          name: "Ghế thường",
          cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          price: 0,
          color: "blue",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "6bd9d903-f0da-4a15-a1da-a6666660e1ec",
          name: "Ghế VIP",
          cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          color: "green",
          price: 5000,
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },

        {
          id: "b0e7b9df-d4ef-4ecf-a92b-0805c8d57a24",
          name: "Ghế Sweet",
          cinemaId: "6d673084-c26f-4ac0-b7dd-dbc7fcba2e6f",
          color: "pink",
          price: 15000,
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
