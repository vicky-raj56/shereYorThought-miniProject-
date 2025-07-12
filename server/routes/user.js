import express from "express";
import {
  editProfilePostController,
  getEditProfilePostController,
  getLoginController,
  getProfileController,
  getProfilePicController,
  getRegisterController,
  loginController,
  logutController,
  profileController,
  profileLikesController,
  profilePicController,
  registerController,
} from "../controllers/user.js";
import isLogedIn from "../middlewares/isLogin.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.get("/", getRegisterController);
router.post("/register", registerController);

router.get("/login", getLoginController);
router.post("/login", loginController);
router.get("/logout", logutController);

router.get("/profile", isLogedIn, getProfileController);
router.post("/profile", isLogedIn, profileController);
router.get("/likes/:id", isLogedIn, profileLikesController);
router.get("/edit/:id", isLogedIn, getEditProfilePostController);
router.post("/update/:id", isLogedIn, editProfilePostController);
router.get("/profile/upload/", isLogedIn, getProfilePicController);
router.post("/upload", isLogedIn, upload.single("image"),profilePicController);

export default router;
