import express from "express";
import { UserRoutes } from "../modules/User/user.router";
import { AuthRouter } from "../modules/Auth/auth.route";
import { BookRoutes } from "../modules/Book/book.route";
import { SaleRoutes } from "../modules/Sales/sale.router";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/books",
    route: BookRoutes,
  },
  {
    path: "/sales",
    route: SaleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
