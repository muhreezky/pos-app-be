const { validationResult } = require("express-validator");
const { Product, Category } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

const productsController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Menambahkan produk baru ke dalam database
   */
  addProduct: async (req, res) => {
    try {
      const { product_name, price, description, category_id } = req.body;
      const category = await Category.findOne({
        where: { category_id }
      });
      const { category_name } = category;
      // console.log(req.file);
      // console.log(req.files);
      // console.log(req.body);
      const path = req.file.path.replace(/\\/g, "/").replace("static/", "");
      // console.log(req.headers.port);
      const image_url = `${req.protocol}://${req.headers.host}/${path}`;
      await Product.create({
        user_id: req.user.user_id,
        product_name,
        price,
        description,
        category_id,
        image_url,
        category_name
      });

      return res.status(201).json({
        message: "Product Added",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Mengubah status produk menjadi aktif atau tidak aktif
   */
  changeStatus: async (req, res) => {
    try {
      const { product_id } = req.params;
      const product = await Product.findOne({
        where: {
          product_id,
        },
      });

      product.active = !product.active;

      await product.save();

      return res.status(200).json({
        message: `Product ${product.active ? "Activated" : "Disabled"}`,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Mengubah data sebuah produk
   */
  editProduct: async (req, res) => {
    try {
      const result = validationResult(req);
      console.log(result.array);
      const { product_id } = req.params;
      const { product_name, price, description, category_id } = req.body;

      const category = await Category.findOne({
        where: { category_id }
      });

      console.log(category.category_id);

      const path = req.file?.path || "";
      const imgUrl = path && `${req.protocol}://${req.headers.host}/${path
        .replace(/\\/g, "/")
        .replace("static/", "")}`;
      const product = await Product.findOne({
        where: {
          product_id,
        },
      });

      const deletePath = product.image_url.replace(
        `${req.protocol}://${req.headers.host}/`,
        ""
      );

      path && await fs.unlink(`${__dirname}/../static/${deletePath}`, (err) => {
        if (err) return res.status(500).json({ message: err.message });
      });

      await product.set({
        product_name: product_name || product.product_name,
        image_url: path ? imgUrl : product.image_url,
        price: price !== "0" ? price : product.price,
        description: description || product.description,
        category_id: category_id || product.category_id,
        category_name: category.category_name
      });

      await product.save();

      return res.status(200).json({
        message: "Product Edited",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Menghapus produk dari database
   */
  deleteProduct: async (req, res) => {
    try {
      const { product_id } = req.params;
      await Product.destroy({
        where: {
          product_id,
        },
      });
      return res.status(200).json({
        message: "Product Deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Menampilkan produk
   */
  viewProduct: async (req, res) => {
    const { category_id, product_name, orderby, dir } = req.query;
    // Membatasi jumlah yang ditampilkan sebanyak 9 per halaman
    try {
      const page = req.query.page || 1; // Halaman default adalah 1 jika tidak diberi req.query.page
      const limit = 9; // Jumlah maksimal data yang dapat ditampilkan dalam satu halaman
      const offset = (page - 1) * limit;
      const direction = dir ? dir.toUpperCase() : "ASC";

      let products = {};
      
      if (category_id || product_name) {
        products = await Product.findAndCountAll({
          limit,
          offset,
          where: {
            user_id: req.user.user_id,
            [Op.or]: [
              {
                product_name: {
                  [Op.iLike]: `${product_name}%`,
                },
              },
              {
                category_id,
              },
            ],
          },
        });
        
      } else {
        products = await Product.findAndCountAll({
          limit,
          offset,
          where: {
            user_id: req.user.user_id,
          },
          order: [[orderby || "product_name", direction]],
        });
      }
      // console.log(products);
      const pages = [];
      const pagesCount = Math.ceil(products.count / limit);
      for (let i = 1; i <= pagesCount; i++) {
        if (!pagesCount) {
          pages.push(1);
          return;
        }
        pages.push(i);
      }

      console.log(pages);
      return res.status(200).json({...products, pages});
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  /**
   * @param {import("express").Response} req
   * @param {import("express").Request} res
   */
  searchProduct: async (req, res) => {
    try {
      const { keyword } = req.query;

      const products = Product.findAndCountAll({
        where: {
          product_name: {
            [Op.ilike]: `${keyword}%`
          }
        }
      });

      return res.status(200).json(products);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = productsController;
