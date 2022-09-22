import { Client, configLogger } from "mysql";

await configLogger({ enable: false });

const client = await new Client().connect({
  hostname: Deno.env.get("DB_HOST"),
  port: parseInt(Deno.env.get("DB_PORT") ?? "3306"),
  username: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASS"),
  db: Deno.env.get("DB_NAME"),
});

export { client as database };
