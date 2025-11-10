import express from "express";
import { esewaRouter } from "./esewa.routes.js";
import { orderRouter } from "./order.routes.js";

export function orderRoutes(app){

    const esewarouter = esewaRouter();

    const orderRouteLogic = orderRouter()

    const orderRouter1 = express.Router();

    orderRouter1.use("/esewa", esewarouter);
    orderRouter1.use("/internal",orderRouteLogic);

    app.use("/api/v1/order", orderRouter1)
}