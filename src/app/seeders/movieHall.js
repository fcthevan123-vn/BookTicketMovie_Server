"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "MovieHalls",
      [
        {
          id: "30ee4983-a7c0-4045-ae96-0edfc5b8479e",
          name: "Phòng chiếu 1",
          number: 1,
          roomTypeId: "20309041-b52c-4aaa-9b9e-60278bd6541a",
          cinemaId: "399e049f-345c-4b6a-bca7-cf91abbdb85f",
          layoutId: "38eb74e4-5ba3-4aa9-9959-2ca225ce9889",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "b33f60e1-a6f7-4225-bb5a-8d11a569fde8",
          name: "Phòng chiếu 2",
          number: 2,
          roomTypeId: "db6d5f6e-8d9a-47a1-83ff-d2710b7b9211",
          cinemaId: "4f7d6e71-60c1-41e5-8674-534ad93c7f31",
          layoutId: "b3d11cd2-e626-420b-9a27-cb666b7dc7e4",
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
