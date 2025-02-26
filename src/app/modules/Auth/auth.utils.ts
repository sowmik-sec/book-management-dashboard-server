import jwt from "jsonwebtoken";
export const createToken = (
  data: Record<string, unknown>,
  secret: string,
  expiresIn: number
) => {
  return jwt.sign(data, secret, { expiresIn: `${expiresIn}d` });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
