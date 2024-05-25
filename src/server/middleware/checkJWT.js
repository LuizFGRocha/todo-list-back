import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/JWTService.js";

// Checa o token JWT presente nos cookies da requisição
// contra o id do usuário
export const checkJwtToken = async (req, res, next) => {
  const token = req.cookies["access_token"];

  if (!token)
    return res.status(StatusCodes.FORBIDDEN).json({
      error: "Access denied",
    });

  const jwtData = JWTService.verify(token);

  if (jwtData === "JWT_SECRET_NOT_FOUND") {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "The JWT_SECRET was not defined",
    });
  } else if (jwtData === "INVALID_TOKEN") {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: "Token verification failed",
    });
  } else if (String(res.locals.user._id) !== String(jwtData.uid)) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: "Access denied",
    });
  }

  return next();
};
