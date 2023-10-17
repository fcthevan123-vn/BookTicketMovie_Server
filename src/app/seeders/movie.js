"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Movies",
      [
        {
          id: "41933121-7deb-43fe-b387-e317868f60e4",
          title: "phim hay quas ne123 hayh xem di nhes",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          directors: ["The Van", "Bui Kiet"],
          actors: ["The Van", "Bui Kiet", "Duy"],
          language: "Việt Nam",
          country: "Anh",
          subtitle: "Anh",
          releaseDate: "2023-10-03 15:03:38+07",
          endDate: "2023-10-31 15:03:38+07",
          images: [
            "https://show-booking.s3.amazonaws.com/08bda76b4584ec9e23c6",
            "https://show-booking.s3.amazonaws.com/fe9c7f3fb4256acb2f15",
            "https://show-booking.s3.amazonaws.com/f8d4fb583213b8ce33d0",
          ],
          genre: ["Hành động", "Hài kịch", "Kịch tính"],
          duration: 123,
          ageRequire: 12,
          countBooked: 0,
          createdAt: "2023-09-17 15:04:44.798+07",
          updatedAt: "2023-10-06 21:23:26.172+07",
        },

        {
          id: "6900eb5c-44d4-44a7-868d-a2732c7c62cf",
          title: "phim hay quas ",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          directors: ["The Van 1", "Bui Kiet 1"],
          actors: ["The Van 1", "Bui Kiet 1", "Duy 1"],
          language: "Việt Nam",
          country: "Anh",
          subtitle: "Anh",
          releaseDate: "2023-10-03 15:03:38+07",
          endDate: "2023-10-31 15:03:38+07",
          images: [
            "https://show-booking.s3.amazonaws.com/08bda76b4584ec9e23c6",
            "https://show-booking.s3.amazonaws.com/fe9c7f3fb4256acb2f15",
            "https://show-booking.s3.amazonaws.com/f8d4fb583213b8ce33d0",
          ],
          genre: ["Hành động", "Hài kịch", "Kịch tính"],
          duration: 123,
          ageRequire: 12,
          countBooked: 0,
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
