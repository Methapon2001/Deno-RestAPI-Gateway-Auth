import * as bcrypt from "bcrypt";
import { getNumericDate } from "djwt";
import { RouterMiddleware, Status } from "oak";
import {
  selectAccountByEmail,
  selectAccountByUUID,
} from "../database/account.ts";
import {
  deleteTokenByAccountUUID,
  deleteTokenByTokenUUID,
  insertToken,
  selectToken,
} from "../database/token.ts";
import { logger } from "../helpers/logger.ts";
import { createToken, verifyToken } from "../helpers/token.ts";

const issueTokenPair = async (
  data: { account_uuid: string; email: string; role: string },
) => {
  const accessTokenPayload = {
    uuid: data.account_uuid,
    email: data.email,
    role: data.role,
    exp: getNumericDate(15 * 60),
  };

  const refreshTokenPayload = {
    uuid: data.account_uuid,
    exp: getNumericDate(30 * 24 * 60 * 60),
  };

  const accessToken = await createToken(accessTokenPayload);
  const refreshToken = await createToken(refreshTokenPayload);

  await insertToken(
    refreshTokenPayload.uuid,
    refreshToken,
    new Date(refreshTokenPayload.exp * 1000),
  );

  return { accessToken, refreshToken };
};

export const login: RouterMiddleware<string> = async (ctx) => {
  const { email, password } = await ctx.request.body().value;

  if (!email || !password) {
    return ctx.throw(
      Status.BadRequest,
      "Request body must have email and password.",
    );
  }

  const accountRecord = await selectAccountByEmail(email);

  if (!accountRecord) {
    return ctx.throw(
      Status.Unauthorized,
      "Incorrect email or password",
    );
  }

  const valid = await bcrypt.compare(password, accountRecord.password);

  if (!valid) {
    return ctx.throw(
      Status.Unauthorized,
      "Incorrect email or password",
    );
  }

  const { accessToken, refreshToken } = await issueTokenPair(accountRecord);

  ctx.response.status = Status.OK;
  ctx.response.body = {
    result: "success",
    token: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  };
};

export const logout: RouterMiddleware<string> = async (ctx) => {
  const { token } = await ctx.request.body().value;

  if (!token) {
    return ctx.throw(
      Status.BadRequest,
      "Request body must have token.",
    );
  }

  const tokenRecord = await selectToken(token);

  if (tokenRecord && tokenRecord.account_uuid !== ctx.state.account.uuid) {
    return ctx.throw(
      Status.Forbidden,
      `You must be owner of the account to perform this action.`,
    );
  }

  if (tokenRecord) {
    await deleteTokenByTokenUUID(tokenRecord.token_uuid);
  }

  ctx.response.status = Status.OK;
  ctx.response.body = {
    result: "success",
  };
};

export const refresh: RouterMiddleware<string> = async (ctx) => {
  const { token } = await ctx.request.body().value;

  if (!token) {
    return ctx.throw(
      Status.BadRequest,
      "Request body must have token.",
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return ctx.throw(
      Status.Unauthorized,
      "Refresh token is invalid or expired.",
    );
  }

  const tokenRecord = await selectToken(token);

  if (!tokenRecord) {
    await deleteTokenByAccountUUID(payload.uuid as string);

    logger.warning(
      `Refresh token reuse detected for account uuid: ${payload.uuid}.`,
    );

    return ctx.throw(
      Status.Unauthorized,
      "Refresh token was invalidated.",
    );
  }

  const accountRecord = await selectAccountByUUID(tokenRecord.account_uuid);

  const { accessToken, refreshToken } = await issueTokenPair(accountRecord);

  await deleteTokenByTokenUUID(tokenRecord.token_uuid);

  ctx.response.status = Status.OK;
  ctx.response.body = {
    result: "success",
    token: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  };
};

export const check: RouterMiddleware<string> = async (ctx) => {
  const authorization = ctx.request.headers.get("Authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization?.split(" ")[1]
    : null;

  if (!accessToken) {
    ctx.response.status = Status.OK;
    ctx.response.body = {
      result: "success",
      is_authenticated: false,
    };
    return;
  }

  const payload = await verifyToken(accessToken);

  if (!payload) {
    ctx.response.status = Status.OK;
    ctx.response.body = {
      result: "success",
      is_authenticated: false,
    };
    return;
  }

  ctx.response.status = Status.OK;
  ctx.response.body = {
    result: "success",
    is_authenticated: true,
    data: payload,
  };
};
