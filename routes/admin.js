const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const prodController = require("../controllers/product");
const userController = require("../controllers/auth");
const adminOrder = require("../controllers/admin/adminOrder");
const adminUser = require("../controllers/admin/adminUser");
const adminProduct = require("../controllers/admin/adminProduct");

const validate = require("../middlewares/validate");
const objectIdSchema = require("../validators/objectIdValid");
const prod = require("../validators/productvalid");
const orderStatusSchema = require("../validators/orderStatusValid");
const userSchema = require("../validators/registerValid");

// Product Routes
router.get(
  "/products",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  prodController.getAllProducts
);
router.get(
  "/products/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(objectIdSchema(), "params"),
  prodController.getSingleProduct
);
router.post(
  "/products",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  upload.array("image", 5),
  validate(prod.productSchema),
  adminProduct.addProduct
);
router.patch(
  "/products/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  upload.array("image", 5),
  validate(objectIdSchema(), "params"),
  validate(prod.prodUpdateSchema),
  adminProduct.updateProduct
);
router.delete(
  "/products/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(objectIdSchema(), "params"),
  adminProduct.deleteProduct
);

// Order Routes
router.get(
  "/orders",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  adminOrder.getAllOrders
);
router.get(
  "/orders/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(objectIdSchema(), "params"),
  adminOrder.getSingleOrder
);
router.patch(
  "/orders/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(objectIdSchema(), "params"),
  validate(orderStatusSchema),
  adminOrder.updateOrder
);
router.delete(
  "/orders/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(objectIdSchema(), "params"),
  adminOrder.deleteOrder
);

// User Routes
router.get(
  "/users",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  adminUser.getAllUsers
);
router.get(
  "/users/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(objectIdSchema(), "params"),
  adminUser.getSingleUser
);
router.post(
  "/users",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(userSchema),
  userController.register
);
router.delete(
  "/users/:id",
  auth.authenticateToken,
  auth.authorizeRoles("admin"),
  validate(objectIdSchema(), "params"),
  adminUser.deleteUser
);

module.exports = router;
