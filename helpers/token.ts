import * as jwt from "djwt";

const header: jwt.Header = {
  alg: "HS256",
  typ: "JWT",
};
const secret = Deno.env.get("JWT_SECRET") || "secret";
const encoder = new TextEncoder();
const buffer = encoder.encode(secret);
const key = await crypto.subtle.importKey(
  "raw",
  buffer,
  {
    name: "HMAC",
    hash: "SHA-256",
  },
  true,
  ["sign", "verify"],
);

export const createToken = async (payload: jwt.Payload): Promise<string> => {
  return await jwt.create(header, payload, key);
};

export const verifyToken = async (
  token: string,
): Promise<jwt.Payload | null> => {
  return await jwt.verify(token, key).catch((_e) => null);
};
