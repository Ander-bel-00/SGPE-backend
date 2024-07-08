'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('BlacklistTokens', 'token', {
      type: Sequelize.STRING(512),
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('BlacklistTokens', 'token', {
      type: Sequelize.STRING(1500),
      allowNull: false,
      unique: true
    });
  }
};
