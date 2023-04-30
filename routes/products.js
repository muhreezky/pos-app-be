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
routes.delete("/:product_id", verifyToken, productsController.deleteProduct);
routes.get("/", verifyToken, productsController.viewProduct);
routes.get("/search", verifyToken, productsController.searchProduct);

routes.post(
  "/categories",
  verifyToken,
  body("category_name").isString(),
  categoryController.addCategory
);
routes.put(
  "/categories/:category_id",
  verifyToken,
  body("category_name").isString(),
  categoryController.editCategory
);
routes.get("/categories", verifyToken, categoryController.categoriesList);
routes.get("/categories/:category_id", verifyToken, categoryController.viewCategory);
routes.delete("/categories/:category_id", verifyToken, categoryController.removeCategory);


module.exports = routes;
