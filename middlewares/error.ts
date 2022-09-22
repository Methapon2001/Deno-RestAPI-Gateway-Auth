import { isHttpError, Middleware, Status } from "oak";
import { logger } from "../helpers/logger.ts";

export const error: Middleware = async (ctx, next) => {
  await next().catch((e: Error) => {
    if (!isHttpError(e)) {
      logger.error(e.stack);
    }

    ctx.response.status = isHttpError(e)
      ? e.status
      : Status.InternalServerError;
    ctx.response.body = {
      result: "error",
      error: {
        message: isHttpError(e)
          ? e.message
          : "Unknown error, please try again later.",
        datetime: new Date().toISOString(),
      },
    };
  });

  if (ctx.response.status === Status.NotFound) {
    ctx.response.body = {
      result: "error",
      error: {
        message: "Page not found.",
        datetime: new Date().toISOString(),
      },
    };
  }

  if (ctx.response.status === Status.MethodNotAllowed) {
    ctx.response.body = {
      result: "error",
      error: {
        message: "Method not allowed.",
        datetime: new Date().toISOString(),
      },
    };
  }
};
