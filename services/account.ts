import * as bcrypt from "bcrypt";
import { RouterMiddleware, Status } from "oak";
import {
  deleteAccountByUUID,
  insertAccount,
  selectAccountByEmail,
  selectAccountByUUID,
  updateAccountByUUID,
} from "../database/account.ts";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createAccount: RouterMiddleware<string> = async (ctx) => {
  const { email, password } = await ctx.request.body().value;

  if (!email || !password) {
    return ctx.throw(
      Status.BadRequest,
      "Request body must have email and password.",
    );
  }

  if (!emailRegex.exec(email)) {
    return ctx.throw(
      Status.BadRequest,
      `Invalid email address.`,
    );
  }

  const ret = await selectAccountByEmail(email);

  if (ret) {
    return ctx.throw(
      Status.Conflict,
      `Account with this email already exists.`,
    );
  }

  const hashedPassword = await bcrypt.hash(password);

  await insertAccount({
    email: email,
    password: hashedPassword,
    role: "user",
  });

  ctx.response.status = Status.Created;
  ctx.response.body = {
    result: "success",
  };
};

export const viewAccount: RouterMiddleware<string> = async (ctx) => {
  const { uuid } = ctx.params;

  if (uuid != ctx.state.account.uuid) {
    return ctx.throw(
      Status.Forbidden,
      `You must be owner of the account to access to this resource.`,
    );
  }

  const ret = await selectAccountByUUID(uuid);

  ctx.response.status = Status.OK;
  ctx.response.body = {
    result: "success",
    data: {
      email: ret.email,
      role: ret.role,
    },
  };
};

export const updateAccount: RouterMiddleware<string> = async (ctx) => {
  const { uuid } = ctx.params;
  const { email, password } = await ctx.request.body().value;

  if (uuid != ctx.state.account.uuid) {
    return ctx.throw(
      Status.Forbidden,
      `You must be owner of the account to perform this action.`,
    );
  }

  if (email && !emailRegex.exec(email)) {
    return ctx.throw(
      Status.BadRequest,
      `Invalid email address.`,
    );
  }

  const ret = await selectAccountByEmail(email);

  if (ret) {
    return ctx.throw(
      Status.Conflict,
      `Account with this email already exists.`,
    );
  }

  const hashedPassword = password ? await bcrypt.hash(password) : null;

  await updateAccountByUUID(uuid, {
    email: email,
    password: hashedPassword,
  });

  ctx.response.status = Status.OK;
  ctx.response.body = {
    result: "success",
  };
};

export const deleteAccount: RouterMiddleware<string> = async (ctx) => {
  const { uuid } = ctx.params;

  if (uuid != ctx.state.account.uuid) {
    return ctx.throw(
      Status.Forbidden,
      `You must be owner of the account to perform this action.`,
    );
  }

  await deleteAccountByUUID(uuid);

  ctx.response.status = Status.OK;
  ctx.response.body = {
    result: "success",
  };
};
