import { Router } from "express";
import {
  login,
  signup,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({ dest: "uploads/profile" });

const logUpdateProfileHit = (req, res, next) => {
  console.log("Update profile route hit");
  next(); // Call next to move to the next middleware or controller
};
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post(
  "/update-profile",
  logUpdateProfileHit,
  verifyToken,
  updateProfile
);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);

authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
export default authRoutes;
