import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorhandler from "./app/middlewares/globalErrorHandler";
export const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

app.use(globalErrorhandler);
