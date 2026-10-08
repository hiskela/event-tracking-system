import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadEventImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/event-image",
  protect,
  authorize("organizer"),
  upload.single("image"),
  uploadEventImage
);

export default router;