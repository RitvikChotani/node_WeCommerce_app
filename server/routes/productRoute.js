const express = require("express");

const product = require("../controller/productController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth.isAuthenticated, product.getAllProducts);
router.post("/new", auth.isAuthenticated, auth.authRoles("Admin"), product.createProduct);
router.patch("/update/:id", auth.isAuthenticated, auth.authRoles("Admin"), product.updateProduct);
router.delete("/delete/:id", auth.isAuthenticated, auth.authRoles("Admin"), product.deleteProduct);
router.get("/:id", product.getSpecificProduct);
router.put("/review/:id", auth.isAuthenticated, product.createProductReview);
router.get("/reviews/:id", product.getAllReview);
router.delete("/reviews/:id", product.deleteReview);

module.exports = router;
