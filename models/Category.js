const { DataTypes } = require("sequelize");

function Category(sequelize) {
  return sequelize.define("Category", {
    category_id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}

module.exports = Category;