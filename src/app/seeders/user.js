/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: "33f3892a-b3dd-4c49-9838-3138797f989d",
          fullName: "Lai The Van",
          email: "fcthevan12@gmail.com",
          isVerifyEmail: true,
          password:
            "$2a$10$ieEhcud2wzFjaHFP1QTqFumSDMuV5vZK08mavxKOQL2DJ8G1PKmHO",
          phone: "0399619422",
          address: "Nguyen Thong, An Thoi, Binh Thuy",
          count: 24,
          sex: 1,
          age: 21,
          tokenVerify: null,
          type: "user",
          createdAt: "2024-03-17T08:04:44.798Z",
          updatedAt: "2024-04-25T06:06:07.433Z",
        },
        {
          id: "33f3892a-b3dd-4c49-9838-3138797f989f",
          fullName: "Lai The Van",
          email: "fcthevan1@gmail.com",
          isVerifyEmail: true,
          password:
            "$2a$10$ieEhcud2wzFjaHFP1QTqFumSDMuV5vZK08mavxKOQL2DJ8G1PKmHO",
          phone: "0399619422",
          address: "Nguyen Thong, An Thoi, Binh Thuy",
          count: 1,
          sex: 1,
          age: 21,
          tokenVerify: null,
          type: "user",
          createdAt: "2024-03-21T08:04:44.798Z",
          updatedAt: "2024-04-17T12:00:46.099Z",
        },
        {
          id: "33f3892a-b3dd-4c49-9838-3138797f989c",
          fullName: "Lai The Van",
          email: "fcthevan123@gmail.com",
          isVerifyEmail: false,
          password:
            "$2b$10$yidev.gxgy3jpO6ZaCTAaes/4TIgHQfNGd8GG0XZPKq1ddLa86JC6",
          phone: "0399619422",
          address: "Nguyen Thong, An Thoi, Binh Thuy",
          count: 11,
          sex: 1,
          age: 21,
          tokenVerify: null,
          type: "admin",
          createdAt: "2024-04-17T08:04:44.798Z",
          updatedAt: "2024-04-25T06:23:45.697Z",
        },
        {
          id: "409507db-14a0-4d5f-a4a7-dffc17c63d00",
          fullName: "Lại Thế Văn",
          email: "fcthevan1234@gmail.com",
          isVerifyEmail: true,
          password:
            "$2b$10$eRg6AyfLOPYCY8/TTmA96OhNWEJfZ/QamHRBBsXuQEJthtNQYDHWy",
          phone: "0399619422",
          address: "Cần Thơ",
          count: 2,
          sex: 0,
          age: 20,
          tokenVerify: "819ae5d7-9b34-4b1d-a835-8960d3b5f5ae",
          type: "user",
          createdAt: "2024-04-19T00:54:41.314Z",
          updatedAt: "2024-04-19T00:55:27.624Z",
        },

        {
          id: "dacd0aa0-1bf6-476d-87fe-f96af72f60a1",
          fullName: "Tran Duy",
          email: "tranduy@gmail.com",
          isVerifyEmail: false,
          password:
            "$2b$10$C0ImJYB4KbOe1YhB350VtuhqRBH9GlP4tYaylXh1shPSqR2EVaJma",
          phone: "0399619422",
          address: "can tho",
          count: 0,
          sex: 0,
          age: 22,
          tokenVerify: "3154066f-ebb9-4f28-ab3f-aace1479aac7",
          type: "employee",
          createdAt: "2024-04-26T04:29:09.168Z",
          updatedAt: "2024-04-26T04:29:09.168Z",
        },
        {
          id: "46bff40d-abe0-4c64-9c30-4c79cfbf1429",
          fullName: "Bui Kiet",
          email: "buikiet@gmail.com",
          isVerifyEmail: true,
          password:
            "$2b$10$1KWuj.F0yWa6Wz8AqgO4ruM83XLT0ZfL5YVA35Ex0GeLmzwy3gD/q",
          phone: "0399619422",
          address: "An Giang",
          count: 0,
          sex: 0,
          age: 22,
          tokenVerify: "c25c21e5-4aad-4540-bfee-e65e3cd6b777",
          type: "employee",
          createdAt: "2024-04-26T04:31:18.808Z",
          updatedAt: "2024-04-26T04:31:18.808Z",
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
