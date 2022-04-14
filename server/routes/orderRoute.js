const express = require("express");
const router = express.Router();
const order = require("../controller/orderController");
const auth = require("../middleware/auth");

router.post("/new", auth.isAuthenticated, order.createNewOrder);
router.get("/user/:id", auth.isAuthenticated, auth.authRoles("Admin"), order.getOrderDetails);
router.get("/myOrders", auth.isAuthenticated, order.getUserOrderDetails);
router.get("/admin/allOrder", auth.isAuthenticated, auth.authRoles("Admin"), order.getAllOrders);
router.put("/admin/:id", auth.isAuthenticated, auth.authRoles("Admin"), order.updateOrder);
router.delete("/admin/:id", auth.isAuthenticated, auth.authRoles("Admin"), order.deleteOrder);

module.exports = router;
