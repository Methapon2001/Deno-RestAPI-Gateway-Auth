import * as log from "log";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (rec) =>
        `${rec.datetime.toISOString()} [${rec.levelName}]: ${rec.msg}`,
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export const logger = log.getLogger();
