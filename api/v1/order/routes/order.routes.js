import express from "express";
import { orderController } from "../controllers/order.controller.js";

export const orderRouter = () => {

    const router = express.Router();

    router
        .post(
            "/",
            orderController.create
        ).get(
            "/:orderId",
            orderController.get);


    return router

}