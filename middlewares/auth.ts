import { RouterMiddleware, Status } from "oak";
import { verifyToken } from "../helpers/token.ts";

export const auth = (role?: string | string[]): RouterMiddleware<string> => {
  return async (ctx, next) => {
    const authorization = ctx.request.headers.get("Authorization");
    const accessToken = authorization?.startsWith("Bearer ")
      ? authorization?.split(" ")[1]
      : null;

    if (!accessToken) {
      return ctx.throw(Status.Unauthorized, "Unauthorized access.");
    }

    const payload = await verifyToken(accessToken);

    if (!payload) {
      return ctx.throw(Status.Unauthorized, "Unauthorized access.");
    }

    if (!role?.includes(payload.role as string)) {
      return ctx.throw(Status.Forbidden, "Forbidden acccess.");
    }

    ctx.state.account = payload;

    await next();
  };
};
