/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Movies", {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      discountId: {
        allowNull: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      directors: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      actors: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      language: {
        type: Sequelize.STRING,
      },
      trailerLink: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      subtitle: {
        type: Sequelize.STRING,
      },
      releaseDate: {
        type: Sequelize.DATEONLY,
      },
      endDate: {
        type: Sequelize.DATEONLY,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      genre: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      ageRequire: {
        type: Sequelize.STRING,
      },

      countBooked: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      averageRating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Movies");
  },
};
