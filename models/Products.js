const { DataTypes } = require("sequelize");

function Products(sequelize) {
  return sequelize.define("Product", {
    product_id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      defaultValue: "No Description for this item"
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
}

module.exports = Products;