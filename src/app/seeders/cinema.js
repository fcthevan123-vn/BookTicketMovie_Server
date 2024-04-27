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
          userId: "dacd0aa0-1bf6-476d-87fe-f96af72f60a1",
          detailLocation: "Trung tâm thành phố Cần Thơ",
          status: "open",
          hotline: "19002224",
          image:
            "https://img.freepik.com/free-vector/cinema-room-background_1017-8728.jpg?t=st=1714147167~exp=1714150767~hmac=683762572f8ff9a7e58ea22984f1a85c149cbe7ac8748138ac32433a49e7dfdd&w=900",
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
