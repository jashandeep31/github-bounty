import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { webhookMiddleware } from "./webhooks/index.js";
import cors from "cors";
import appRoutes from "./routes/app.routes.js";

const PORT = process.env.PORT || 8000;
const expressApp = express();
expressApp.use(webhookMiddleware);
expressApp.use(express.json());
expressApp.use(cors());

expressApp.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Hello world",
  });
});

expressApp.use("/api/v1/app", appRoutes);
expressApp.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
