import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendCookie } from "../utils/features.js";

export const getAllUsers = async (req, res) => { };

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email or Password",
    });

  }
  const isMatch = await bcrypt.compare(password, user.password);


  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }
  sendCookie(user, res, `Welcome back: ${user.name}`, 200);
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "User Already Exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({ name, email, password: hashedPassword });

  sendCookie(user, res, "Registed Successfully", 201);
};
export const logout = (req, res) => {

  res.status(200).cookie("token", "", { expires: new Date(Date.now()) }).json({
    success: true,
    user: req.user,
    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
    secure: process.env.NODE_ENV === "Development" ? false : true,
  });
}

export const getMyProfile = (req, res) => {

  res.status(200).json({
    success: true,
    user: req.user,
  });
};
