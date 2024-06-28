import express from "express";
import getAllUsers from "../controllers/userController/getUsers.js";
import getUsername from "../controllers/userController/getUsername.js";
import protectedRoute from "../controllers/middleware/protectedRoute.js"
const router = express.Router();

router.get("/getAllUsers",protectedRoute, getAllUsers);
router.get("/getUsername",protectedRoute, getUsername);

export default router;
