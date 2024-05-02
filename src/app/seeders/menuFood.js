/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("MenuFoods", [
      {
        id: "e619e98e-ed6f-421b-955d-e08d9e458193",
        status: "open",
        image: "https://show-booking.s3.amazonaws.com/582cddfa99fe0583463e",
        price: 20000,
        name: "Pepsi",
        createdAt: "2024-05-01T13:23:26.331Z",
        updatedAt: "2024-05-02T04:59:38.708Z",
      },
      {
        id: "7147a194-6c58-4e8c-96a5-6f6b86cd7b5f",
        status: "open",
        image: "https://show-booking.s3.amazonaws.com/84fe1f6576dfd4885748",
        price: 25000,
        name: "Fanta",
        createdAt: "2024-05-02T05:01:22.693Z",
        updatedAt: "2024-05-02T05:01:45.701Z",
      },
      {
        id: "3f92617f-77b2-4595-a88c-da54ac48f914",
        status: "open",
        image: "https://show-booking.s3.amazonaws.com/06d730ebaa1272e61e5b",
        price: 30000,
        name: "Donut",
        createdAt: "2024-05-02T05:18:22.828Z",
        updatedAt: "2024-05-02T05:25:58.958Z",
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
