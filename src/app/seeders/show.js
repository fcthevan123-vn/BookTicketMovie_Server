"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Shows",
      [
        {
          id: "c83a15d0-2226-4779-9464-e903591cabf7",
          startTime: "2023-12-05T03:58:44.739Z",
          endTime: "2023-12-05T05:58:44.739Z",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          date: "2023-12-05",
          movieHallId: "30ee4983-a7c0-4045-ae96-0edfc5b8479e",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T05:58:44.739Z",
        },
        {
          id: "c83a15d0-2226-4779-9464-e904191cabf7",
          startTime: "2023-12-05T03:58:44.739Z",
          endTime: "2023-12-05T05:58:44.739Z",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          date: "2023-12-05",
          movieHallId: "c4b2c270-8e74-408e-92df-94f69964e395",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T05:58:44.739Z",
        },
        {
          id: "c83a15d0-2226-4779-9464-e904191cabf8",
          startTime: "2023-12-05T03:23:44.739Z",
          endTime: "2023-12-05T05:34:44.739Z",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          date: "2023-12-05",
          movieHallId: "30ee4983-a7c0-4045-ae96-0edfc5b8479e",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T05:58:44.739Z",
        },
        {
          id: "c73a15d0-2226-4779-9464-e903591cabf9",
          startTime: "2023-12-05T07:58:44.739Z",
          endTime: "2023-12-05T08:58:44.739Z",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          date: "2023-12-05",
          movieHallId: "30ee4983-a7c0-4045-ae96-0edfc5b8479e",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T05:58:44.739Z",
        },

        {
          id: "c73a15d0-2226-4779-9464-e903591cab10",
          startTime: "2023-12-05T07:58:44.739Z",
          endTime: "2023-12-05T08:58:44.739Z",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          date: "2023-12-05",
          movieHallId: "b33f60e1-a6f7-4225-bb5a-8d11a569fde8",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T05:58:44.739Z",
        },

        {
          id: "a86b7d60-24de-4aa9-bac8-06489f737e47",
          startTime: "2023-12-05T03:58:44.739Z",
          endTime: "2023-12-05T05:58:44.739Z",
          date: "2023-12-05",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          movieHallId: "b33f60e1-a6f7-4225-bb5a-8d11a569fde8",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "a86b7d60-24de-4aa9-bac8-06489f737e61",
          startTime: "2023-12-07T03:58:44.739Z",
          endTime: "2023-12-07T05:58:44.739Z",
          date: "2023-12-07",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          movieHallId: "b33f60e1-a6f7-4225-bb5a-8d11a569fde8",
          createdAt: "2023-09-16T03:58:44.739Z",
          updatedAt: "2023-09-16T03:58:44.739Z",
        },
        {
          id: "a86b7d60-24de-4aa9-bac8-06489f737e32",
          startTime: "2023-12-07T03:58:44.739Z",
          endTime: "2023-12-07T05:58:44.739Z",
          date: "2023-12-07",
          movieId: "41933121-7deb-43fe-b387-e317868f60e4",
          movieHallId: "b33f60e1-a6f7-4225-bb5a-8d11a569fde8",
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
