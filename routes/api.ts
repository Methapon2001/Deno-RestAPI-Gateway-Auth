import { Router } from "oak";
import { auth } from "../middlewares/auth.ts";
import {
  createAccount,
  deleteAccount,
  updateAccount,
  viewAccount,
} from "../services/account.ts";
import { check, login, logout, refresh } from "../services/auth.ts";

const router = new Router();

router.post("/account", createAccount);

router.get("/account/:uuid", auth(), viewAccount);

router.put("/account/:uuid", auth(), updateAccount);

router.delete("/account/:uuid", auth(), deleteAccount);

router.post("/auth/login", login);

router.get("/auth/check", check);

router.post("/auth/refresh", refresh);

router.post("/auth/logout", auth(), logout);

export { router };
