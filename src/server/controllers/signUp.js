import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      genres: req.body.genres,
    });
    await user.save();
    return res.status(StatusCodes.CREATED).json({
      message: "Signup successful",
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
};
