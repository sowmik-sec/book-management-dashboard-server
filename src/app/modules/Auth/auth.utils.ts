import jwt from "jsonwebtoken";
export const createToken = (
  data: Record<string, unknown>,
  secret: string,
  expiresIn: number
) => {
  return jwt.sign(data, secret, { expiresIn: `${expiresIn}d` });
};
