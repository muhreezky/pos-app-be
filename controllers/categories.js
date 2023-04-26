const { Category } = require("../models");
const { Op } = require("sequelize");

const categoryController = {
  /**
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   */
  addCategory: async (req, res) => {
    try {
      const { category_name } = req.body;
      await Category.create({ category_name });
      return res.status(201).json({ message: "Category Added" });  
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   */
  editCategory: async (req, res) => {
    try {
      const { category_id } = req.params;
      const { category_name } = req.body;

      await Category.update({ category_name }, {
        where: { category_id }
      });

      return res.status(200).json({ message: "Category Edited" });
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   */
  removeCategory: async (req, res) => {
    try {
      const { category_id } = req.params;

      await Category.destroy({
        where: { category_id }
      });

      return res.status(200).json({ message: "Category Deleted" });
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  categoriesList: async (req, res) => {
    try {
      const data = await Category.findAll();

      return res.status(200).json(data);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = categoryController;