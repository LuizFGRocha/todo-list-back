import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { JWTService } from "../services/JWTService.js";
import { StatusCodes } from "http-status-codes";

export const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid username or password",
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid username or password",
    });
  }

  try {
    const accessToken = JWTService.sign({ uid: user._id });

    if (accessToken === "JWT_SECRET_NOT_FOUND") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal server error",
      });
    }

    res.cookie("access_token", accessToken, { maxAge: 900000, httpOnly: true });

    return res.status(StatusCodes.OK).json({
      message: "Login successful",
      uid: user._id,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
};
