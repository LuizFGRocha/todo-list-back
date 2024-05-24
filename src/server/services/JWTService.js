import jsonwebtoken from 'jsonwebtoken';

const sign = (data) => {
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND';
  
  return jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verify = (token) => {
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND';

  const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

  try {
    return decoded;
  } catch (error) {
    return 'INVALID_TOKEN';
  }
};

export const JWTService = {
  sign,
  verify,
};