import express from "express";
import upload from "../utils/multer.js";
import {
  createTour,
  deleteTour,
  getAllTour,
  getFeaturedTour,
  getSingaleTour,
  getTourBySearch,
  getTourCount,
  updateTour,
} from "../controllers/tourController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//create tour
router.post("/", verifyAdmin, upload.single("photo"), createTour);
//updae tour
// Update tour with image upload
router.put("/:id", verifyAdmin, upload.single("photo"), updateTour);
//delete tour
router.delete("/:id",verifyAdmin, deleteTour);
//get single tour
router.get("/:id", getSingaleTour);
//getAll tour
router.get("/", getAllTour);
//get tour by search
router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getFeaturedTour", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);


export default router;
