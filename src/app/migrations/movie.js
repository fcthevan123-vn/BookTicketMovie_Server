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
      country: {
        type: Sequelize.STRING,
      },
      subtitle: {
        type: Sequelize.STRING,
      },
      releaseDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
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
        type: Sequelize.INTEGER,
      },

      countBooked: {
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
