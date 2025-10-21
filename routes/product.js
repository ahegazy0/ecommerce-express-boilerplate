const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");
const validate = require("../middlewares/validate");
const objectIdSchema = require("../validators/objectIdValid");

// Public Product Routes
router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/categories", productController.getProductCategories);
router.get("/search", productController.searchProducts);
router.get(
  "/:id",
  validate(objectIdSchema(), "params"),
  productController.getSingleProduct
);

module.exports = router;
