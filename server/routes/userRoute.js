const express = require("express");
const routes = express.Router();

const user = require("../controller/userController");
const auth = require("../middleware/auth");

routes.post("/register", user.registerUser);
routes.post("/login", user.loginUser);
routes.post("/logout", user.logoutUser);
routes.post("/forgot", user.forgotPassword);
routes.put("/reset/:token", user.resetPassword);
routes.get("/me", auth.isAuthenticated, user.getUserDetails);
routes.post("/me/updatePassword", auth.isAuthenticated, user.updatePassword);
routes.put("/me/update", auth.isAuthenticated, user.updateUserProfile);
routes.get("/admin/users", auth.isAuthenticated, auth.authRoles("Admin"), user.getAllUsers);
routes.get("/admin/users/:id", auth.isAuthenticated, auth.authRoles("Admin"), user.getOneUser);
routes.put("/admin/users/:id", auth.isAuthenticated, auth.authRoles("Admin"), user.updateUserDetailsAndRoles);
routes.delete("/admin/users/:id", auth.isAuthenticated, auth.authRoles("Admin"), user.deleteUser);

module.exports = routes;
