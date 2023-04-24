const { Product } = require("../models");

const productsController = {
  // Menambah product baru ke dalam database
  addProduct: async (req, res) => {},
  // Mengubah status product dari aktif menjadi nonaktif, begitu juga sebaliknya
  changeStatus: async (req, res) => {},
  // Mengubah data tentang sebuah produk
  editProduct: async (req, res) => {},
  // Menghapus produk dari database
  deleteProduct: async (req, res) => {
    try {
      await Product.delete();
      return res.status(200).json({
        message: "Product Deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  // Menampilkan data produk
  viewProduct: async (req, res) => {
    // Membatasi jumlah yang ditampilkan sebanyak 9 per halaman
    try {
      const page = req.query.page || 1; // Halaman default adalah 1 jika tidak diberi req.query.page
      const limit = 9; // Jumlah maksimal data yang dapat ditampilkan dalam satu halaman
      const offset = (page - 1) * limit;
      const products = await Product.findAndCountAll({
        limit,
        offset,
        where: {
          user_id: req.user.user_id,
        },
      });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = productsController;
