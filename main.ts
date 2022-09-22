import "dotenv-load";

import { Application } from "oak";
import { oakCors } from "cors";

import { logger } from "./helpers/logger.ts";
import { router } from "./routes/api.ts";
import { error } from "./middlewares/error.ts";

const { APP_HOST, APP_PORT } = Deno.env.toObject();

const app = new Application();

app.use(error);
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  logger.info(
    `Listening on ${secure ? "https://" : "http://"}${hostname}:${port}`,
  );
});

await app.listen({
  hostname: APP_HOST,
  port: parseInt(APP_PORT || "3000"),
});
