import { Router } from "express";
import { checkStatus } from "../controllers/app.controler.js";

const routes = Router();

routes.route("/check-access/:user/:repo").get(checkStatus);

export default routes;
