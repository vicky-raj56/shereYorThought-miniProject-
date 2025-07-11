import express from "express";
import {
  editProfilePostController,
  getEditProfilePostController,
  getLoginController,
  getProfileController,
  getRegisterController,
  loginController,
  logutController,
  profileController,
  profileLikesController,
  registerController,
} from "../controllers/user.js";
import isLogedIn from "../middlewares/isLogin.js";
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

export default router;
