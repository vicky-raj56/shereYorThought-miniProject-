import userModel from "../models/user.model.js";
import postModel from "../models/post.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getRegisterController = async (req, res) => {
  res.render("index");
};

const registerController = async (req, res) => {
  const { name, username, email, password, age } = req.body;
  if (!name || !username || !email || !password || !age) {
    return res
      .status(400)
      .json({ Success: false, message: "All fields are required" });
  }
  const exstingUser = await userModel.findOne({ email });
  if (exstingUser) {
    return res
      .status(400)
      .json({ success: false, message: "user already register" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const user = new userModel({
    name,
    username,
    email,
    age,
    password: hashPassword,
  });
  const newuser = await user.save();

  const token = jwt.sign({ email, username }, "shhh");
  res.cookie("token", token);
  res.status(201).json({
    success: true,
    message: "user created successfully",
    user: newuser,
  });
};
// login get route

const getLoginController = async (req, res) => {
  res.render("login");
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (!existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or passwpord" });
  }
  const isMatchPassword = await bcrypt.compare(password, existingUser.password);
  if (!isMatchPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Inavlid email or password" });
  }
  const token = jwt.sign(
    { email: existingUser.email, userId: existingUser._id },
    "shhh",
    {
      expiresIn: "1d",
    }
  );
  res.cookie("token", token);
  res.redirect("/profile");
};
// logout to redirect login and clear cookie
const logutController = async (req, res) => {
  const token = await req.cookies.token;
  // console.log(token)
  // res.cookie("token","");
  res.clearCookie("token");
  res.redirect("/login");
};

// get profile page
const getProfileController = async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  // console.log(user)
  // console.log(user);

  // console.log(user.posts)
  res.render("profile", { user });
};

const profileController = async (req, res) => {
  const { user, content } = req.body;
  const exstinguser = await userModel.findOne({ email: req.user.email });
  const creatUser = new postModel({
    user: exstinguser._id,
    content,
  });
  const newUser = await creatUser.save();

  exstinguser.posts.push(newUser._id);
  await exstinguser.save();
  // res.status(200).send({user:exstinguser})
  res.redirect("/profile");
};

const profileLikesController = async (req, res) => {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user");
  // console.log(post.user)
  if (post.likes.indexOf(req.user.userId) === -1) {
    post.likes.push(req.user.userId);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userId), 1);
  }
  await post.save();

  res.redirect("/profile");
};

const getEditProfilePostController = async (req, res) => {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user");

  res.render("edit", { post });
};

const editProfilePostController = async (req, res) => {
  // const postId = req.params.id;
  const post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content },
    { new: true }
  );
  res.redirect("/profile");
};

// profilepic show
const getProfilePicController =  (req, res) => {
  res.render("profilepic");
};
const profilePicController = async (req, res) => {
  // console.log(req.file)
  const user = await userModel.findOne({email:req.user.email});
  if(!user){
    return res.send("user not found ")
  };
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect("profile")
};

export {
  registerController,
  getRegisterController,
  getLoginController,
  loginController,
  logutController,
  getProfileController,
  profileController,
  profileLikesController,
  getEditProfilePostController,
  editProfilePostController,
  getProfilePicController,
  profilePicController,
};
