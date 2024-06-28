import express from "express";

import registerUser from "../controllers/authController/register.js";
import loginUser from "../controllers/authController/login.js";
const router = express.Router();


//public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
