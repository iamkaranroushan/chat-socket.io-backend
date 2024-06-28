import express from "express";
import  saveMedia from "../controllers/mediaController/saveMedia.js";
import  fetchMedia from "../controllers/mediaController/fetchMedia.js";
import protectedRoute from "../controllers/middleware/protectedRoute.js"
const router = express.Router();

router.post("/saveMedia",protectedRoute, saveMedia);
router.get("/fetchMedia",protectedRoute, fetchMedia);

export default router;
