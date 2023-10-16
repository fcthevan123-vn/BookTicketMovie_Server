"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: "33f3892a-b3dd-4c49-9838-3138797f989c",
          fullName: "?Lai The Van",
          email: "fcthevan123@gmail.com",
          isVerifyEmail: false,
          password:
            "$2b$10$yidev.gxgy3jpO6ZaCTAaes/4TIgHQfNGd8GG0XZPKq1ddLa86JC6",
          phone: "0399619422",
          address: "Nguyen Thong, An Thoi, Binh Thuy",
          sex: 1,
          age: 21,
          type: "admin",
          createdAt: "2023-09-17 15:04:44.798+07",
          updatedAt: "2023-10-06 21:23:26.172+07",
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
