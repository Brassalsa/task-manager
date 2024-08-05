import bcrypt from "bcryptjs";

const encKey = 10;

export const hashStr = (str: string) => {
  return bcrypt.hashSync(str, encKey);
};

export const compareHash = (str: string, hash: string) => {
  return bcrypt.compareSync(str, hash);
};
