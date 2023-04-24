const { DataTypes } = require("sequelize");

function Transaction (sequelize) {
  return sequelize.define("Transaction", {
    transaction_id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    total_trx: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  });
}

module.exports = Transaction;