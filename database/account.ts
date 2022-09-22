import { database } from "./connect.ts";

interface AccountInterface {
  email?: string | null;
  password?: string | null;
  role?: "user" | "admin" | null;
}

export const insertAccount = async (account: AccountInterface) => {
  return await database.execute(
    "INSERT INTO `account` (`email`, `password`, `role`) VALUES (?, ?, ?)",
    [
      account.email ?? null,
      account.password ?? null,
      account.role ?? null,
    ],
  );
};

export const selectAccountByUUID = async (uuid: string) => {
  const [ret] = await database.query(
    "SELECT * FROM `account` WHERE `account_uuid` = ?",
    [uuid],
  );
  return ret;
};

export const selectAccountByEmail = async (email: string) => {
  const [ret] = await database.query(
    "SELECT * FROM `account` WHERE `email` = ?",
    [email],
  );
  return ret;
};

export const updateAccountByUUID = async (
  uuid: string,
  account: AccountInterface,
) => {
  return await database.execute(
    "UPDATE `account` SET `email` = COALESCE(?, `email`), `password` = COALESCE(?, `password`), `role` = COALESCE(?, `role`) WHERE `account_uuid` = ?",
    [
      account.email ?? null,
      account.password ?? null,
      account.role ?? null,
      uuid,
    ],
  );
};

export const deleteAccountByUUID = async (uuid: string) => {
  return await database.execute(
    "DELETE FROM `account` WHERE `account_uuid` = ?",
    [uuid],
  );
};

export const deleteAccountByEmail = async (email: string) => {
  return await database.execute(
    "DELETE FROM `account` WHERE `email` = ?",
    [email],
  );
};
