import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import { createBooking, getAllBooking, getBooking, confirmBooking, deleteBooking } from "../controllers/bookingController.js";

const router = express.Router()

router.post('/', verifyUser, createBooking)
router.get('/:id', verifyUser, getBooking)
router.get('/', verifyAdmin, getAllBooking)
router.put("/confirm/:id", verifyAdmin, confirmBooking);
router.delete("/:id", deleteBooking);

export default router