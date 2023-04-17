const router = require("express").Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const orderController = require("../controllers/order");

router
  .route("/")
  .get(
    auth.protect,
    auth.restrictTo("Administrator"),
    orderController.getAllOrders
  )
  .post(
    auth.protect,
    auth.restrictTo("Administrator"),
    multer(orderController.multerConfig).single("image"),
    orderController.createOrder
  );

router
  .route("/:id")
  .get(auth.protect, auth.restrictTo("Administrator"), orderController.getOrder)
  .patch(
    auth.protect,
    auth.restrictTo("Administrator"),
    multer(orderController.multerConfig).single("image"),
    orderController.updateOrder
  )
  .delete(
    auth.protect,
    auth.restrictTo("Administrator"),
    orderController.deleteOrder
  );

module.exports = router;
