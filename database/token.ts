import { database } from "./connect.ts";

export const insertToken = async (
  account_uuid: string,
  token: string,
  expires_at: Date,
) => {
  return await database.execute(
    "INSERT INTO `token` (`account_uuid`, `token`, `expires_at`) VALUES (?, ?, ?)",
    [account_uuid, token, expires_at],
  );
};

export const selectToken = async (token: string) => {
  const [ret] = await database.query(
    "SELECT * FROM `token` WHERE `token` = ?",
    [token],
  );

  return ret;
};

export const selectTokenByAccountUUID = async (uuid: string) => {
  const [ret] = await database.query(
    "SELECT * FROM `token` WHERE `account_uuid` = ?",
    [uuid],
  );

  return ret;
};

export const deleteTokenByTokenUUID = async (uuid: string) => {
  return await database.execute(
    "DELETE FROM `token` WHERE `token_uuid` = ?",
    [uuid],
  );
};

export const deleteTokenByAccountUUID = async (uuid: string) => {
  return await database.execute(
    "DELETE FROM `token` WHERE `account_uuid` = ?",
    [uuid],
  );
};
