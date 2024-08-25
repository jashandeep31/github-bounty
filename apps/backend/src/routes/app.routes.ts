import { Router } from "express";
import {
  checkStatus,
  putUnCollectedPayoutInQueue,
} from "../controllers/app.controler.js";

const routes = Router();

routes.route("/check-access/:user/:repo").get(checkStatus);
routes.route("/process-payout/:id").post(putUnCollectedPayoutInQueue);
export default routes;
