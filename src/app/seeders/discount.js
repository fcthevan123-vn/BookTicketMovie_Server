/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Discounts",
      [
        {
          id: "b3b717e3-3871-4a20-963b-13190b45f3f6",
          startDate: "2024-04-13T10:06:16+00:00",
          endDate: "2024-04-18T10:06:16+00:00",
          quantity: "37",
          percentDiscount: "20",
          nameDiscount: "LaiTheVanCTU",
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
