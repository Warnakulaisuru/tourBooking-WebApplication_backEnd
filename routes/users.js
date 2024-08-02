import express from "express";
import {
  deleteUser,
  getAllUser,
  getSingaleUser,
  updateUser,
} from "../controllers/userController.js";
const router = express.Router();

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

//updae User
router.put("/:id", verifyUser, updateUser);
//delete User
router.delete("/:id", verifyUser, deleteUser);
//get User
router.get("/:id",verifyUser, getSingaleUser);
//getAll User
router.get("/", verifyAdmin, getAllUser);

export default router;
