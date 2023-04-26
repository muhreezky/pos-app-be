const routes = require("express").Router();
const upload = require("../upload");

const { productsController, categoryController } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { body } = require("express-validator");

// Menghindari penulisan kode berulang kali, menggunakan variable dataProduct
const dataProduct = [
  verifyToken,
  upload.single("product_image"),
  body("product_name").matches(/[a-z0-9 ]/gi),
  body("price").isNumeric(),
  body("description").isString(),
  body("category_id").isNumeric(),
];

routes.post("/", ...dataProduct, productsController.addProduct);

routes.put("/:product_id", ...dataProduct, productsController.editProduct);

routes.get("/", verifyToken, productsController.viewProduct);

routes.delete("/:product_id", verifyToken, productsController.deleteProduct);

routes.post(
  "/categories",
  verifyToken,
  body("category_name").isString(),
  categoryController.addCategory
);

routes.get("/categories", verifyToken, categoryController.categoriesList);

module.exports = routes;
