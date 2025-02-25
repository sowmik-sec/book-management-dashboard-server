import express, { Express, Request, Response } from "express";
import cors from "cors";
export const app: Express = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});
